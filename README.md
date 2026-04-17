# 💍 Wedding Expense Tracker

A premium, full-stack web application designed to help couples manage their wedding finances with a modern, glassmorphic UI.

![Dashboard Preview](frontend/src/assets/wedding_bg.png)

## ✨ Features

- **Modern UI/UX**: Illustrative glassmorphic design using Tailwind CSS and Framer Motion.
- **Unified Dashboard**: Real-time spending summaries and interactive charts (Recharts).
- **Event Sections**: Dedicated tracking for Engagement, Mehndi, Marriage, and Dinner.
- **CRUD Operations**: Securely add, edit, and delete expenses for every category.
- **Authentication**: JWT-based login and signup system for private data management.
- **CSV Export**: Export filtered expense reports to CSV for external use.
- **Mobile Responsive**: Fully adaptive design for cross-device usage.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Recharts, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express.js, JWT Authentication.
- **Database**: MongoDB (Atlas) via Mongoose ORM.
- **Hosting**: Prepared for Vercel (Frontend) and Render (Backend).

## 🚀 Getting Started Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed.
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI.

### 2. Setup Backend
```bash
cd backend
npm install
node seed.js  # Optional: Seed sample data
npm start
```
*Creates a server at `http://localhost:5000`*

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
*Launches the app at `http://localhost:5173`*

## 🌐 Deployment (Free Tier)

This project is optimized for deployment on:
- **Frontend**: [Vercel](https://vercel.com/)
- **Backend**: [Render](https://render.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

For detailed deployment steps, please refer to the `walkthrough.md`.

## 🔒 Environment Variables
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

---
*Created with ❤️ by Prasad Shetty*
