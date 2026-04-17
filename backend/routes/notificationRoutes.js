const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const Notification = require('../models/Notification');

// @route   GET api/notifications
// @desc    Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    // Find notifications for this user OR global notifications (userId: null)
    const notifications = await Notification.find({
      $or: [{ userId: req.user.id }, { userId: { $exists: false } }, { userId: null }]
    }).sort({ createdAt: -1 });
    
    res.json(notifications);
  } catch (err) {
    console.error('❌ GET NOTIFICATIONS ERROR:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST api/notifications/admin
// @desc    Admin send notification
router.post('/admin', [auth, admin], async (req, res) => {
  const { userId, message } = req.body;

  try {
    const newNotification = new Notification({
      userId: userId || null, // null means global broadcast
      message
    });

    const notification = await newNotification.save();
    res.json(notification);
  } catch (err) {
    console.error('❌ SEND NOTIFICATION ERROR:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
