require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Check if super admin already exists
    const existingSuperAdmin = await Admin.findOne({ role: 'super_admin' });
    
    if (existingSuperAdmin) {
      console.log('✓ Super admin already exists');
      console.log(`  Email: ${existingSuperAdmin.email}`);
      await mongoose.connection.close();
      return;
    }

    // Get credentials from environment variables
    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;
    const firstName = process.env.SUPER_ADMIN_FIRST_NAME || 'Super';
    const lastName = process.env.SUPER_ADMIN_LAST_NAME || 'Admin';

    if (!email || !password) {
      console.error('ERROR: SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in .env file');
      await mongoose.connection.close();
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create super admin
    const superAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'super_admin',
      permissions: ['all'],
      isActive: true
    });

    await superAdmin.save();

    console.log('✓ Super admin created successfully');
    console.log(`  Email: ${email}`);
    console.log(`  Name: ${firstName} ${lastName}`);
    console.log('  Role: super_admin');

    await mongoose.connection.close();
    console.log('✓ Database connection closed');
  } catch (error) {
    console.error('Error creating super admin:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createSuperAdmin();
