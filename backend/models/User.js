const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  budgets: {
    Engagement: { type: Number, default: 0 },
    Mehndi: { type: Number, default: 0 },
    Marriage: { type: Number, default: 0 },
    Dinner: { type: Number, default: 0 },
    Haldi: { type: Number, default: 0 },
    GrandTotal: { type: Number, default: 0 }
  },
  phone: { type: String, default: '' },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  weddingRole: { 
    type: String, 
    enum: ['Brother', 'Sister', 'Planner', 'Other', 'Bride', 'Groom', 'Associate', ''], 
    default: 'Planner' 
  },
  profileImage: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
