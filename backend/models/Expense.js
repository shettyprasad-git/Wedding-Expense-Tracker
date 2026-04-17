const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { 
    type: String, 
    required: true, 
    enum: ['engagement', 'mehndi', 'marriage', 'dinner'] 
  },
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true
  },
  price: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);
