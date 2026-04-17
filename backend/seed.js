const mongoose = require('mongoose');
const User = require('./models/User');
const Expense = require('./models/Expense');
const dotenv = require('dotenv');

dotenv.config();

const sampleExpenses = [
  { section: 'Engagement', title: 'Ring Purchase', category: 'Miscellaneous', amount: 50000, date: '2024-01-15', notes: 'Diamond solitaire' },
  { section: 'Engagement', title: 'Hotel Grand Hall', category: 'Hall Booking', amount: 30000, date: '2024-01-20', notes: 'Initial deposit' },
  { section: 'Mehndi', title: 'Mehndi Artist', category: 'Makeup / Dressing', amount: 15000, date: '2024-02-10', notes: 'For bride and family' },
  { section: 'Mehndi', title: 'Decor & Flowers', category: 'Decorations', amount: 20000, date: '2024-02-12', notes: 'Marigold theme' },
  { section: 'Marriage', title: 'Main Banquet Hall', category: 'Hall Booking', amount: 150000, date: '2024-03-01', notes: 'Full day booking' },
  { section: 'Marriage', title: 'Wedding Photography', category: 'Photography', amount: 80000, date: '2024-03-01', notes: 'Photo + Video' },
  { section: 'Marriage', title: 'Bridal Makeup', category: 'Makeup / Dressing', amount: 35000, date: '2024-03-01', notes: 'Premium package' },
  { section: 'Dinner', title: 'Catering (300 Guests)', category: 'Catering / Food', amount: 120000, date: '2024-03-02', notes: 'Buffet dinner' },
  { section: 'Dinner', title: 'Music & Lighting', category: 'Decorations', amount: 25000, date: '2024-03-02', notes: 'DJ included' },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB...');

    // Create a default user
    const existingUser = await User.findOne({ email: 'admin@example.com' });
    let userId;
    
    if (!existingUser) {
      const user = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123'
      });
      const savedUser = await user.save();
      userId = savedUser._id;
      console.log('Default user created: admin@example.com / password123');
    } else {
      userId = existingUser._id;
    }

    // Clear existing expenses for this user
    await Expense.deleteMany({ userId });

    // Add sample expenses
    const expensesWithUser = sampleExpenses.map(exp => ({ ...exp, userId }));
    await Expense.insertMany(expensesWithUser);

    console.log('Sample data seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
