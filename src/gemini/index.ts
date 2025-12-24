// gemini/index.ts  (create this file similar to your openAi/index.ts)
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY in environment variables");
}

const gemini = new GoogleGenAI({ apiKey });

export default gemini;
