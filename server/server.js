import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { GoogleGenAI } from "@google/genai";

import PG from "./models/PG.js";
import authRoutes from "./routes/authRoutes.js";
import { requireAuth, requireRole } from "./middleware/auth.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Check required environment variables
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is missing from the .env file.");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing from the .env file.");
  process.exit(1);
}

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    })
  : null;

// MongoDB connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

// Authentication routes:
// POST /api/auth/signup
// POST /api/auth/login
// GET  /api/auth/me
app.use("/api/auth", authRoutes);

// Existing Gemini AI endpoint
app.post("/api/ai/generate-description", async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        message: "Gemini AI is not configured. Check GEMINI_API_KEY.",
      });
    }

    const {
      pgName,
      location,
      rent,
      sharing,
      amenities = [],
    } = req.body;

    const prompt = `
Create a professional, attractive and student-friendly PG accommodation description.

PG Name: ${pgName || "Not provided"}
Location: ${location || "Not provided"}
Monthly Rent: ${rent || "Not provided"}
Sharing Type: ${sharing || "Not provided"}
Amenities: ${
      Array.isArray(amenities) && amenities.length > 0
        ? amenities.join(", ")
        : "None specified"
    }

Requirements:
- Write one clear paragraph.
- Keep it suitable for a student accommodation website.
- Do not invent facilities or information that were not provided.
- Keep the description around 80-120 words.
- Use a friendly but professional tone.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    return res.status(200).json({
      description: response.text,
    });
  } catch (error) {
    console.error("Gemini error:", error.message);

    return res.status(500).json({
      message: "Failed to generate description.",
    });
  }
});

// Health-check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    message: "StayMatch AI backend is running!",
    database:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected",
  });
});

// Create a PG listing
// Only authenticated owners can create listings
app.post(
  "/api/pgs",
  requireAuth,
  requireRole("owner"),
  async (req, res) => {
    try {
      const {
        pgName,
        location,
        rent,
        sharing,
        amenities,
        description,
        ownerName,
        contactNumber,
        image,
      } = req.body;

      // Validate required fields
      if (
        typeof pgName !== "string" ||
        !pgName.trim() ||
        typeof location !== "string" ||
        !location.trim() ||
        rent === undefined ||
        rent === null ||
        rent === "" ||
        !Number.isFinite(Number(rent)) ||
        Number(rent) < 0 ||
        typeof sharing !== "string" ||
        !sharing.trim()
      ) {
        return res.status(400).json({
          message: "Please provide a valid PG name, location, rent, and sharing type.",
        });
      }

      if (
        amenities !== undefined &&
        (!Array.isArray(amenities) ||
          !amenities.every((item) => typeof item === "string"))
      ) {
        return res.status(400).json({
          message: "Amenities must be a list of strings.",
        });
      }

      const newPG = await PG.create({
        pgName: pgName.trim(),
        location: location.trim(),
        rent: Number(rent),
        sharing: sharing.trim(),
        amenities: amenities || [],
        description:
          typeof description === "string" ? description.trim() : "",
        ownerName:
          typeof ownerName === "string" ? ownerName.trim() : "",
        contactNumber:
          typeof contactNumber === "string"
            ? contactNumber.trim()
            : "",
        image: typeof image === "string" ? image.trim() : "",

        // Set the owner from the verified token, never from the request body
        owner: req.user.id,

        // New listings remain unverified until an actual verification process exists
        isVerified: false,
      });

      return res.status(201).json({
        message: "PG listing created successfully!",
        pg: newPG,
      });
    } catch (error) {
      console.error("Error creating PG:", error.message);

      return res.status(400).json({
        message: "Failed to create PG listing.",
        error: error.message,
      });
    }
  }
);

// Update a PG listing
// Only authenticated owners can update, and only their OWN listings:
// the listing is found by BOTH the URL id AND the logged-in owner's id,
// so another owner's listing simply "is not found".
app.put(
  "/api/pgs/:id",
  requireAuth,
  requireRole("owner"),
  async (req, res) => {
    try {
      // Reject ids that are not valid MongoDB ids
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid listing id." });
      }

      const pg = await PG.findOne({
        _id: req.params.id,
        owner: req.user.id,
      });

      if (!pg) {
        return res.status(404).json({
          message: "Listing not found, or you do not own it.",
        });
      }

      const {
        pgName,
        location,
        rent,
        sharing,
        amenities,
        description,
        ownerName,
        contactNumber,
        image,
      } = req.body;

      // Same required-field checks as creating a listing
      if (
        typeof pgName !== "string" ||
        !pgName.trim() ||
        typeof location !== "string" ||
        !location.trim() ||
        rent === undefined ||
        rent === null ||
        rent === "" ||
        !Number.isFinite(Number(rent)) ||
        Number(rent) < 0 ||
        typeof sharing !== "string" ||
        !sharing.trim()
      ) {
        return res.status(400).json({
          message: "Please provide a valid PG name, location, rent, and sharing type.",
        });
      }

      if (
        amenities !== undefined &&
        (!Array.isArray(amenities) ||
          !amenities.every((item) => typeof item === "string"))
      ) {
        return res.status(400).json({
          message: "Amenities must be a list of strings.",
        });
      }

      // Update only the allowed fields.
      // "owner" and "isVerified" are never changed from the request.
      pg.pgName = pgName.trim();
      pg.location = location.trim();
      pg.rent = Number(rent);
      pg.sharing = sharing.trim();
      if (amenities !== undefined) pg.amenities = amenities;
      if (typeof description === "string") pg.description = description.trim();
      if (typeof ownerName === "string") pg.ownerName = ownerName.trim();
      if (typeof contactNumber === "string") pg.contactNumber = contactNumber.trim();
      // Only change the image if a new one was sent (editing never erases it)
      if (typeof image === "string") pg.image = image.trim();

      await pg.save();

      return res.status(200).json({
        message: "PG listing updated successfully!",
        pg,
      });
    } catch (error) {
      console.error("Error updating PG:", error.message);

      return res.status(400).json({
        message: "Failed to update PG listing.",
        error: error.message,
      });
    }
  }
);

// Get only the logged-in owner's PG listings
app.get(
  "/api/pgs/mine",
  requireAuth,
  requireRole("owner"),
  async (req, res) => {
    try {
      const pgs = await PG.find({
        owner: req.user.id,
      }).sort({ createdAt: -1 });

      return res.status(200).json(pgs);
    } catch (error) {
      console.error("Error fetching owner's PG listings:", error.message);

      return res.status(500).json({
        message: "Failed to fetch your PG listings.",
      });
    }
  }
);

// Get all PG listings
// Public endpoint: students can browse without logging in
app.get("/api/pgs", async (req, res) => {
  try {
    const pgs = await PG.find().sort({ createdAt: -1 });

    return res.status(200).json(pgs);
  } catch (error) {
    console.error("Error fetching PGs:", error.message);

    return res.status(500).json({
      message: "Failed to fetch PG listings.",
    });
  }
});

// Start server after connecting to MongoDB
async function startServer() {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();