const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();async function t(){const g=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);try{const m=g.getGenerativeModel({model:"gemini-2.5-flash"});await m.generateContent("hi");console.log("SUCCESS: gemini-2.5-flash")}catch(e){console.log("FAIL: "+e.message.split('\n')[0])}}t();
