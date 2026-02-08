const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function testModel(modelName) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log(`\nTesting model: ${modelName}...`);
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Hello, are you working?");
    const response = await result.response;
    console.log(`✅ SUCCESS: ${modelName}`);
    // console.log("Response:", response.text());
    return true;
  } catch (error) {
    console.log(`❌ FAILED: ${modelName}`);
    console.log(`Error: ${error.message.split('\n')[0]}`); // Print first line of error
    return false;
  }
}

async function runTests() {
  console.log("Using API Key:", process.env.GEMINI_API_KEY ? "Found" : "Missing");
  
  const models = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-002",
    "gemini-pro",
    "gemini-1.0-pro"
  ];

  for (const model of models) {
    await testModel(model);
  }
}

runTests();
