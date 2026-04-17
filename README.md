# 💍 Wedding Expense Tracker: Elite SaaS Evolution 🚀✨

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://weddingexpense.vercel.app/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/shettyprasad-git/Wedding-Expense-Tracker)

A professional, production-grade SaaS platform designed to help couples and wedding professionals manage multi-ceremony finances with an elite, glassmorphic UI and robust administrative control.

![Dashboard Preview](frontend/src/assets/wedding_bg.png)

## 🌐 Live System
**[Portal URL: weddingexpense.vercel.app](https://weddingexpense.vercel.app/)**

---

## 🔥 Enterprise SaaS Features

### 1. Multi-Role RBAC System
- **Planner Identity**: Role-based access control (RBAC) distinguishing between `User` (Wedding Planner) and `Admin` (System Architect).
- **Wedding Roles**: Context-aware profiles for `Managing Planner`, `Brother`, `Sister`, and `Associate`.
- **Admin Guard**: Secure administrative portals protected by backend middleware and frontend route guards.

### 2. Admin Command Center (`/admin/dashboard`)
- **Global User Registry**: Track and manages all wedding planners in the ecosystem.
- **Inquiry Management**: A robust ticketing system to analyze and resolve platform issues.
- **Broadcast Node**: Dispatch global alerts or targeted notifications to specific users in real-time.

### 3. Professional Support Hub (`/support`)
- **Priority Ticketing**: Users can raise platform inquiries with `Low`, `Medium`, or `High` urgency.
- **Real-time Notifications**: A glassmorphic notification hub in the navbar alerting users of administrative updates and ticket resolutions.

### 4. Identity & Aesthetics
- **3-Mode Avatar System**: Curated presets for Male/Female identities or custom image URL integration.
- **Contact Experts**: Direct access to GitHub, LinkedIn, and Email for design and architectural consultation.
- **Precision Analytics**: Ceremony-specific portfolios for Engagement, Mehndi, Marriage, and Dinner with real-time budget tracking.

---

## 🛠️ Technical Stack

- **Frontend**: React.js, Vite, Tailwind CSS v4, Lucide-React v1.8.0, Framer Motion.
- **Backend**: Node.js, Express.js, MongoDB Atlas.
- **Security**: JWT-based private data isolation & Role-based middleware.
- **State**: Context API for synchronized Authentication, Expenses, and Notifications.

---

## 🚀 Deployment & Setup

### 1. Administrative Bootstrap
The system includes a startup seeder. To establish the master admin account:
- Ensure `MONGODB_URI` is set in `backend/.env`.
- The server automatically creates/elevates the **Prasad Shetty** (`prasad@admin.com`) account on startup.

### 2. Local Environment
**Backend**:
```bash
cd backend && npm install && npm start
```
**Frontend**:
```bash
cd frontend && npm install && npm run dev
```

---

## 🔒 Environment Variables
Required in `backend/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

---
*Developed with ❤️ for perfect ceremonies and professional planning.*
