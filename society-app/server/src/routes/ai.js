const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const auth = require('../middleware/auth');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MOCK_KEY');

router.post('/chat', auth, async (req, res) => {
  const { message } = req.body;
  const user = req.user;

  if (!process.env.GEMINI_API_KEY) {
    return res.json({ 
      response: "Namaste! I am in demo mode right now because the API key is missing. But I can tell you that SocietySync is working perfectly! Please add the GEMINI_API_KEY to the .env file to enable my full brain. 🚀" 
    });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are FunkiAI, a smart and helpful society management assistant for the "SocietySync" app.
      
      User Context:
      - Name: ${user.name}
      - Role: ${user.role} (admin or member)
      
      Your Goal:
      - Help with maintenance payments.
      - Explain society rules.
      - Guide through dashboard features.
      - Be polite, professional, and use a bit of Indian context (Hinglish is okay if user uses it).
      - Keep responses concise and helpful.
      
      User Message: ${message}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error('Gemini Error:', error);
    res.status(500).json({ response: "I'm feeling a bit dizzy. Let me try again in a moment!" });
  }
});

module.exports = router;
