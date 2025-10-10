import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Dynamically import pdfjsLib
let pdfjsLib;

const initializePdfJs = async () => {
  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  }
};

// Set the worker path for pdfjs
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const extractText = async (filePath, mimetype) => {
  if (mimetype === "application/pdf") {
    try {
      // Initialize pdfjs if not already done
      await initializePdfJs();
      
      // Set worker path - using the correct worker file
      pdfjsLib.GlobalWorkerOptions.workerSrc = join(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.mjs');
      
      // Load the PDF document
      const pdf = await pdfjsLib.getDocument({ url: filePath }).promise;
      let textContent = "";

      // Extract text from each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        textContent += text.items.map(item => item.str).join(" ") + "\n";
      }

      return textContent.trim();
    } catch (error) {
      console.error("PDF parsing error:", error);
      throw new Error("Failed to parse PDF file");
    }
  } else {
    // For text files
    return fs.readFileSync(filePath, "utf-8");
  }
};

export default extractText;