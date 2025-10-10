import fs from "fs";
import path from "path";
import extractText from "../utils/extractText.js";

export const handleFileUpload = async (req, res) => {
  // Check if file was uploaded
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = req.file.path;
  try {
    const content = await extractText(filePath, req.file.mimetype);
    // Cleanup the temporary file
    fs.unlinkSync(filePath);
    res.json({ content, fileName: req.file.originalname });
  } catch (err) {
    // Cleanup the temporary file even if extraction fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error("File processing error:", err);
    res.status(500).json({ error: "Failed to process file: " + err.message });
  }
};