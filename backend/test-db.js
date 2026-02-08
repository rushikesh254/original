const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  console.log('Testing MongoDB connection...');
  console.log('URI:', process.env.MONGODB_URI);
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connection successful!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();
