const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const SupportTicket = require('../models/SupportTicket');

// @route   POST api/support
// @desc    User submits a support ticket
router.post('/', auth, async (req, res) => {
  const { subject, description, priority } = req.body;

  try {
    const newTicket = new SupportTicket({
      userId: req.user.id,
      subject,
      description,
      priority: priority || 'Medium'
    });

    const ticket = await newTicket.save();
    res.json(ticket);
  } catch (err) {
    console.error('❌ SUBMIT TICKET ERROR:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET api/support/admin/tickets
// @desc    Admin view all tickets
router.get('/admin/tickets', [auth, admin], async (req, res) => {
  try {
    const tickets = await SupportTicket.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error('❌ GET TICKETS ERROR:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT api/support/admin/tickets/:id
// @desc    Admin update ticket status
router.put('/admin/tickets/:id', [auth, admin], async (req, res) => {
  const { status } = req.body;

  try {
    let ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    ticket.status = status || ticket.status;
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    console.error('❌ UPDATE TICKET ERROR:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
