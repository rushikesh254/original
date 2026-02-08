const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testKey() {
  const key = "AIzaSyA3rqIidBaGikEsQ81Mf_ieerScxQ8KPlU";
  console.log("Testing key...");
  try {
    const genAI = new GoogleGenerativeAI(key);
    // Use the same model as the app
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); 
    
    const result = await model.generateContent("Reply with 'Working' if you receive this.");
    const response = await result.response;
    const text = response.text();
    console.log("SUCCESS: API Key is working.");
    console.log("Response:", text);
  } catch (error) {
    console.error("FAILURE: API Key failed.");
    console.error("Error Message:", error.message);
    if (error.message.includes("API_KEY_INVALID")) {
        console.error("Reason: The API Key is invalid.");
    }
    if (error.message.includes("quota")) {
        console.error("Reason: Quota exceeded.");
    }
  }
}

testKey();
