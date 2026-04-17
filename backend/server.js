const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const supportRoutes = require('./routes/supportRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Robust CORS to allow Vercel
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization', 'Accept'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ status: 'ok', database: dbStatus, timestamp: new Date() });
});

// Database Connection and Admin Bootstrap
const User = require('./models/User');

const bootstrapAdmin = async () => {
  try {
    const adminEmail = 'prasad@admin.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const newAdmin = new User({
        name: 'Prasad Shetty',
        email: adminEmail,
        password: 'prasad@admin', // Hashed by User model pre-save hook
        role: 'admin',
        weddingRole: 'Planner'
      });
      await newAdmin.save();
      console.log('✨ Bootstrap: Administrative account created (Prasad Shetty)');
    } else if (existingAdmin.role !== 'admin') {
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('✨ Bootstrap: Existing user elevated to Admin status');
    }
  } catch (err) {
    console.error('⚠️ Bootstrap Error:', err.message);
  }
};

console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Successfully connected to MongoDB');
    console.log(`📡 Database: ${process.env.MONGODB_URI.split('@').pop()}`); 
    
    // Initialize Admin
    await bootstrapAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
