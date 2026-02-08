const mongoose = require('mongoose');

const atlasUri = "mongodb+srv://rushikesh:sQH7QZ5r9iWPtAA@cluster0.wlwvpyb.mongodb.net/ai-recipe-app?retryWrites=true&w=majority";

async function testConnection() {
  console.log('Testing Atlas MongoDB connection...');
  try {
    await mongoose.connect(atlasUri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connection successful!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();
