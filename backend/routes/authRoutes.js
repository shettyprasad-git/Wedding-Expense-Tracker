const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST api/auth/signup
// @desc    Register user
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ name, email, password });
    await user.save();

    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
      }
    );
  } catch (err) {
    console.error('❌ SIGNUP ERROR:', err.message);
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
      }
    );
  } catch (err) {
    console.error('❌ LOGIN ERROR:', err.message);
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

// @route   GET api/auth/profile
// @desc    Get user profile details
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT api/auth/profile
// @desc    Update user profile details
router.put('/profile', auth, async (req, res) => {
  const { name, phone, role, profileImage } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (role) user.role = role;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error('❌ UPDATE PROFILE ERROR:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT api/auth/budgets
// @desc    Update user specific budgets
router.put('/budgets', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.budgets = { ...user.budgets, ...req.body };
    await user.save();

    res.json(user.budgets);
  } catch (err) {
    console.error('❌ UPDATE BUDGETS ERROR:', err.message);
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

// @route   GET api/auth/user
// @desc    Get user data
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('❌ GET USER ERROR:', err.message);
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

module.exports = router;
