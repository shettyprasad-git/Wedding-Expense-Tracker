const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Expense = require('./models/Expense');

dotenv.config();

const MAPPING = {
  'Hall Management': 'Venue & Hall',
  'Hall': 'Venue & Hall',
  'Catering Management': 'Catering & Food',
  'Catering': 'Catering & Food',
  'Decoration Management': 'Decoration & Setup',
  'Decoration': 'Decoration & Setup',
  'Travel Management': 'Travel & Logistics',
  'Travel': 'Travel & Logistics',
  'Misc Management': 'Miscellaneous',
  'Misc': 'Miscellaneous',
  'Other Management': 'Other (Custom)',
  'Other': 'Other (Custom)'
};

const migrate = async () => {
  try {
    console.log('🚀 Starting Category Migration...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const expenses = await Expense.find({});
    console.log(`📊 Found ${expenses.length} total expenses.`);

    let updatedCount = 0;

    for (const exp of expenses) {
      if (MAPPING[exp.category]) {
        exp.category = MAPPING[exp.category];
        await exp.save();
        updatedCount++;
      }
    }

    console.log(`✨ Migration Complete! Updates saved: ${updatedCount}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration Failed:', err.message);
    process.exit(1);
  }
};

migrate();
