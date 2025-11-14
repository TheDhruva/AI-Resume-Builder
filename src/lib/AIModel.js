// src/lib/AIModel.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Load API key from .env
const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
if (!apiKey) {
  throw new Error("❌ Missing API key: set VITE_GOOGLE_AI_API_KEY in .env file");
}

// ✅ Initialize Gemini client
const genAI = new GoogleGenerativeAI(apiKey);

// ✅ Reusable text generation function
export async function generateText(prompt) {
  try {
    // ⚡ Use the correct model name!
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);

    // ✅ Extract clean text response
    const text = result.response.text();
    return text;
  } catch (err) {
    console.error("❌ Gemini API error:", err);
    throw err;
  }
}
