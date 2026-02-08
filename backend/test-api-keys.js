#!/usr/bin/env node
/**
 * AI API KEY TESTER
 * Tests if your AI API keys are working correctly.
 * 
 * Usage: node test-api-keys.js
 * Or test specific: node test-api-keys.js groq
 */

require('dotenv').config();

const testFunctions = {
  // Test Groq API
  async groq() {
    const Groq = require('groq-sdk');
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const result = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Say "API working" in 3 words' }],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 20
    });
    return result.choices[0].message.content;
  },

  // Test xAI (Grok) API
  async xai() {
    const OpenAI = require('openai');
    const openai = new OpenAI({ 
      apiKey: process.env.XAI_API_KEY,
      baseURL: "https://api.x.ai/v1" 
    });
    const result = await openai.chat.completions.create({
      model: 'grok-4-latest',
      messages: [{ role: 'user', content: 'Say "API working" in 3 words' }],
      max_tokens: 20
    });
    return result.choices[0].message.content;
  },

  // Test OpenAI API
  async openai() {
    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const result = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say "API working" in 3 words' }],
      max_tokens: 20
    });
    return result.choices[0].message.content;
  },

  // Test Gemini API
  async gemini() {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent('Say "API working" in 3 words');
    return result.response.text();
  },

  // Test Together AI API
  async together() {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo',
        messages: [{ role: 'user', content: 'Say "API working" in 3 words' }],
        max_tokens: 20
      })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content;
  },

  // Test Anthropic Claude API
  async anthropic() {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 20,
        messages: [{ role: 'user', content: 'Say "API working" in 3 words' }]
      })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.content[0].text;
  }
};

// API key environment variable names
const apiKeyNames = {
  groq: 'GROQ_API_KEY',
  xai: 'XAI_API_KEY',
  openai: 'OPENAI_API_KEY',
  gemini: 'GEMINI_API_KEY',
  together: 'TOGETHER_API_KEY',
  anthropic: 'ANTHROPIC_API_KEY'
};

async function testAPI(name) {
  const keyName = apiKeyNames[name];
  const key = process.env[keyName];
  
  // Check if key exists
  if (!key || key === 'YOUR_' + name.toUpperCase() + '_API_KEY_HERE') {
    return { name, status: '⚪ NOT SET', message: `${keyName} not configured` };
  }

  try {
    const response = await testFunctions[name]();
    return { 
      name, 
      status: '✅ WORKING', 
      message: response.substring(0, 50).trim() 
    };
  } catch (error) {
    let errorMsg = error.message || 'Unknown error';
    if (errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('rate')) {
      return { name, status: '⚠️ RATE LIMITED', message: 'Quota exceeded' };
    }
    if (errorMsg.includes('401') || errorMsg.includes('invalid') || errorMsg.includes('Incorrect')) {
      return { name, status: '❌ INVALID KEY', message: 'Authentication failed' };
    }
    return { name, status: '❌ FAILED', message: errorMsg.substring(0, 50) };
  }
}

async function main() {
  console.log('\n🔑 AI API KEY TESTER\n' + '='.repeat(50));
  
  const specificAPI = process.argv[2]?.toLowerCase();
  const apisToTest = specificAPI ? [specificAPI] : Object.keys(testFunctions);
  
  for (const api of apisToTest) {
    if (!testFunctions[api]) {
      console.log(`❓ Unknown API: ${api}`);
      continue;
    }
    
    process.stdout.write(`\n🔍 Testing ${api.toUpperCase()}... `);
    const result = await testAPI(api);
    console.log(`${result.status}`);
    console.log(`   └─ ${result.message}`);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('💡 To test specific API: node test-api-keys.js <api-name>');
  console.log('   Example: node test-api-keys.js groq\n');
}

main().catch(console.error);
