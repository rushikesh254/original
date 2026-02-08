const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
async function l(){
  const g=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const model = g.getGenerativeModel({ model: "gemini-1.5-flash" }); 
    // Usually listModels is on the client? No, it's not directly exposed in the high level SDK easily?
    // Wait, check docs. SDK has generic request support? or I can try a direct fetch.
    // I will try direct fetch to list models.
    const key = process.env.GEMINI_API_KEY;
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await resp.json();
    if(data.models) {
      console.log("MODELS FOUND: " + data.models.map(m=>m.name).join(", "));
    } else {
      console.log("NO MODELS: " + JSON.stringify(data));
    }
  } catch(e){console.log("ERR: "+e.message)}
}
l();
