import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/ai/generate-description", async (req, res) => {
  try {
    const {
      pgName,
      location,
      rent,
      sharing,
      amenities = [],
    } = req.body;

    console.log("Received request:", {
      pgName,
      location,
      rent,
      sharing,
      amenities,
    });

    const prompt = `
Create a professional, attractive and student-friendly PG accommodation description.

PG Name: ${pgName || "Not provided"}
Location: ${location || "Not provided"}
Monthly Rent: ${rent || "Not provided"}
Sharing Type: ${sharing || "Not provided"}
Amenities: ${amenities.length > 0 ? amenities.join(", ") : "None specified"}

Requirements:
- Write one clear paragraph.
- Keep it suitable for a student accommodation website.
- Do not invent facilities or information that were not provided.
- Keep the description around 80-120 words.
- Use a friendly but professional tone.
`;

    console.log("Sending request to Gemini...");

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    console.log("Gemini response received.");

    res.status(200).json({
      description: response.text,
    });
  } catch (error) {
    console.error("========== GEMINI ERROR ==========");
    console.error(error);
    console.error("==================================");

    res.status(500).json({
      message: "Failed to generate description.",
      error: error.message || "Unknown Gemini error",
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});