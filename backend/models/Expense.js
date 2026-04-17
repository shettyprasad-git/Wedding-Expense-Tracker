const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  section: { 
    type: String, 
    required: true, 
    enum: ['Engagement', 'Mehndi', 'Marriage', 'Dinner'] 
  },
  title: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: [
      'Hall Booking', 
      'Decorations', 
      'Catering / Food', 
      'Photography', 
      'Makeup / Dressing', 
      'Travel / Transport', 
      'Miscellaneous'
    ] 
  },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);
