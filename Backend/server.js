import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import chatRoutes from "./routes/chat.js";
import fileRoutes from "./routes/fileRoutes.js";
import authRoutes from "./routes/newAuthRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";

const app = express();
const PORT = 8080;

// In-memory storage for threads when MongoDB is not available
let inMemoryThreads = new Map();

// Middleware to add in-memory storage to request object
app.use((req, res, next) => {
  req.inMemoryThreads = inMemoryThreads;
  next();
});

app.use(express.json());
app.use(cors());

// Simple request logger for debugging incoming requests
app.use((req, res, next) => {
  try {
    console.log('Incoming request ->', req.method, req.path, 'Content-Type:', req.headers['content-type']);
  } catch (e) {
    // ignore
  }
  next();
});

// Register routes in the correct order
// Public routes first (no authentication required)
app.use("/api/auth", authRoutes);
app.use("/api/image", imageRoutes);

// Protected routes (authentication required)
app.use("/api", chatRoutes);
app.use("/api/files", fileRoutes);

// Validate API keys on startup
const validateAPIKeys = async () => {
  console.log("Validating API keys...");
  
  // Validate Gemini API key
  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️  WARNING: GEMINI_API_KEY is not set in .env file");
    console.warn("   The application will not be able to generate AI responses without a valid API key");
  } else if (!process.env.GEMINI_API_KEY.startsWith("AIza")) {
    console.warn("⚠️  WARNING: GEMINI_API_KEY doesn't have the expected format (should start with 'AIza')");
  } else {
    try {
      // Test the Gemini API key
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
      
      // Simple validation request
      await model.generateContent("Validation test");
      console.log("✅ Gemini API key validation successful");
    } catch (err) {
      console.warn("⚠️  WARNING: Gemini API key validation failed");
      console.warn("   Error:", err.message);
      console.warn("   The application may not be able to generate AI responses");
    }
  }
};

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    validateAPIKeys();
    connectDB();
});

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with Database!");
    } catch(err) {
        console.log("Failed to connect with Db", err);
        console.log("Using in-memory storage as fallback");
    }
}