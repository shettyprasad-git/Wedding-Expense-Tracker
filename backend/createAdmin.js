const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const adminEmail = 'prasad@admin.com';
    const existingUser = await User.findOne({ email: adminEmail });

    if (existingUser) {
      console.log('⚠️ Admin user already exists. Updating role to admin...');
      existingUser.role = 'admin';
      existingUser.name = 'Prasad Shetty';
      existingUser.password = 'prasad@admin'; // This will be re-hashed by pre-save hook
      await existingUser.save();
      console.log('✅ Admin credentials updated successfully');
    } else {
      const admin = new User({
        name: 'Prasad Shetty',
        email: adminEmail,
        password: 'prasad@admin',
        role: 'admin',
        weddingRole: 'Planner'
      });

      await admin.save();
      console.log('✅ Admin account created successfully!');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err);
    process.exit(1);
  }
};

createAdmin();
