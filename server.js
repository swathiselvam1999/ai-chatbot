import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Check whether our API key exists
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing from the .env file");
}

// Connect to Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    timeout: 60000,
  },
});

// Allow Express to read JSON data
app.use(express.json());

// Serve our frontend files
app.use(express.static("public"));

// Chat API
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Please provide a message",
      });
    }

    // Send the user's message to Gemini
    console.log("Sending message to Gemini...");
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: message,
    });
console.log("Gemini response received!");
    // Send Gemini's reply back to the frontend
    res.json({
      reply: response.text,
    });

  } catch (error) {
    console.error("Gemini API error:", error);

    res.status(500).json({
        error: "Sorry, I couldn't generate a response. Please try again."
    });
}
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
