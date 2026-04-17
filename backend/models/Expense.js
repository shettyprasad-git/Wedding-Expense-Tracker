const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  section: { 
    type: String, 
    required: true, 
    enum: ['Engagement', 'Mehndi', 'Marriage', 'Dinner'] 
  },
  name: { type: String, required: true }, // Changed from title
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
  price: { type: Number, required: true }, // Changed from amount
  date: { type: Date, required: true },
  description: { type: String }, // Changed from notes
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);
