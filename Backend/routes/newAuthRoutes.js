import express from "express";
import { register, login, getProfile } from "../controllers/newAuthController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/profile", verifyToken, getProfile);

export default router;