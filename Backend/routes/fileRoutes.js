import express from "express";
import multer from "multer";
import { handleFileUpload } from "../controllers/fileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", verifyToken, upload.single("file"), handleFileUpload);

export default router;