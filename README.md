# 💍 Wedding Expense Tracker: Pro SaaS 🚀✨

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://weddingexpense.vercel.app/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/shettyprasad-git/Wedding-Expense-Tracker)

A premium, production-grade SaaS application designed to help couples manage their wedding finances with a modern, glassmorphic UI and comprehensive identity management.

![Dashboard Preview](frontend/src/assets/wedding_bg.png)

## 🌐 Live Link
**[Visit Website: weddingexpense.vercel.app](https://weddingexpense.vercel.app/)**

---

## ✨ Modern SaaS Features

### 1. Pro-Planning Architecture
- **Sidebar + Navbar Shell**: A professional navigation system featuring a fixed top bar and a responsive side drawer.
- **Persistent Header**: Quick access to global settings and a recursive **Profile Dropdown**.
- **Ceremony Portfolios**: Dedicated, high-fidelity management suites for `Engagement`, `Mehndi`, `Marriage`, and `Dinner`.

### 2. Identity Hub & Avatar Selection
- **Profile Management**: Maintain your wedding identity with customizable Name, Phone, and Wedding Roles.
- **Avatar Gallery**: Click-to-select identity hub featuring 8 curated high-quality wedding and planner portraits.
- **Real-time Sync**: Your visual identity and role are synchronized across the entire platform.

### 3. Advanced Financial Analytics
- **Investment Hero**: High-impact "Total Wedding Investment" card with real-time progress bars.
- **Budget Targets**: Set investment thresholds per ceremony and track actual vs. target spending.
- **Responsive Table/Card Toggle**: Lists automatically transform between **Elite Data Tables** (Desktop) and **Interactive Cards** (Mobile).

### 4. Technical Performance
- **Full-Stack Security**: JWT-based authentication for private data isolation.
- **Glassmorphism Design**: Ultra-premium UI built with Tailwind CSS v4 and Framer Motion.
- **Export Power**: Export your comprehensive financial history to **CSV** or **PDF**.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS v4, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express.js, MongoDB + Mongoose.
- **State**: Context API (Auth & Expense synchronization).
- **Deployment**: Vercel (Frontend), Render (Backend).

---

## 🚀 Local Development

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
*Port: `http://localhost:5000`*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Port: `http://localhost:5173`*

---

## 🌐 Deployment Logic

- **Frontend**: Deployed on [Vercel](https://weddingexpense.vercel.app/).
- **Backend API**: Optimized for [Render](https://render.com/).
- **Database**: Cloud-hosted via [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

---

## 🔒 Security & Env
Required `.env` in `backend/`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

---
*Developed with ❤️ for perfect ceremonies.*
