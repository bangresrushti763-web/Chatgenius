import express from "express";
import { generateImage } from "../controllers/imageController.js";

const router = express.Router();

// Public route for image generation (no authentication required)
router.post("/generate", generateImage);

export default router;