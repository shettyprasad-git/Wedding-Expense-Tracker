const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/admin/users
// @desc    Admin view all users
router.get('/users', [auth, admin], async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('❌ GET USERS ERROR:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
