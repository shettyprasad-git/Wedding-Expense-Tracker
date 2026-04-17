const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// @route   POST api/expenses
// @desc    Add new expense
router.post('/', auth, async (req, res) => {
  const { section, name, category, price, date, description } = req.body;

  try {
    const newExpense = new Expense({
      userId: req.user.id,
      section,
      name,
      category,
      price,
      date,
      description
    });

    const expense = await newExpense.save();
    res.json(expense);
  } catch (err) {
    console.error('❌ ADD EXPENSE ERROR:', err.message);
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

// @route   GET api/expenses
// @desc    Get all user expenses
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error('❌ GET ALL EXPENSES ERROR:', err.message);
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

// @route   GET api/expenses/section/:section
// @desc    Get expenses by section
router.get('/section/:section', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ 
      userId: req.user.id, 
      section: req.params.section 
    }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error('❌ GET SECTION EXPENSES ERROR:', err.message);
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

// @route   PUT api/expenses/:id
// @desc    Update expense
router.put('/:id', auth, async (req, res) => {
  const { name, category, price, date, description } = req.body;

  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    // Make sure user owns expense
    if (expense.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update fields
    expense.name = name || expense.name;
    expense.category = category || expense.category;
    expense.price = price || expense.price;
    expense.date = date || expense.date;
    expense.description = description || expense.description;

    await expense.save();
    res.json(expense);
  } catch (err) {
    console.error('❌ UPDATE EXPENSE ERROR:', err.message);
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

// @route   DELETE api/expenses/:id
// @desc    Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    // Make sure user owns expense
    if (expense.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.json({ message: 'Expense removed' });
  } catch (err) {
    console.error('❌ DELETE EXPENSE ERROR:', err.message);
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

module.exports = router;
