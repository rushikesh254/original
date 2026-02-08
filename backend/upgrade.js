/* upgrade.js */
const mongoose = require("mongoose");
require("dotenv").config(); // Loads .env from current directory

async function upgradeUser(email) {
  try {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI not found in .env");
    }
    await mongoose.connect(process.env.MONGODB_URI);
    const User = require("./models/User");
    const user = await User.findOneAndUpdate(
      { email: email },
      { $set: { subscriptionTier: "pro" } },
      { new: true }
    );
    if (user) {
      console.log(`✅ Success! ${email} is now a PRO user.`);
    } else {
      console.log(`❌ Error: User with email ${email} not found.`);
    }
    await mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

// Get email from command line or hardcode it
const email = process.argv[2] || "[EMAIL_ADDRESS]";
upgradeUser(email);



// node upgrade.js target-user@email.com

// run above command to make any user pro 