import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const getGeminiAPIResponse = async (message) => {
    try {
        // Check if API key is available
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not set in environment variables");
        }
        
        // Initialize Google Generative AI with API key
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // Use the gemini-2.5-flash-lite model as an alternative to gemini-1.5-flash
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        
        // Generate content
        const result = await model.generateContent(message);
        const response = await result.response;
        return response.text();
    } catch (err) {
        console.error("Gemini API Error:", err);
        
        // Provide more specific error messages
        if (err.message.includes("API_KEY_INVALID")) {
            throw new Error("Invalid Gemini API key. Please check your GEMINI_API_KEY in the .env file.");
        } else if (err.message.includes("API_KEY_NOT_FOUND")) {
            throw new Error("Gemini API key not found. Please set your GEMINI_API_KEY in the .env file.");
        } else if (err.message.includes("401")) {
            throw new Error("Unauthorized: Invalid Gemini API key.");
        } else if (err.message.includes("403")) {
            throw new Error("Forbidden: Check your Gemini API key permissions.");
        } else if (err.message.includes("429")) {
            throw new Error("Rate limit exceeded: Too many requests to Gemini API. Please try again later.");
        } else if (err.message.includes("500")) {
            throw new Error("Server error: Gemini service is temporarily unavailable. Please try again later.");
        } else {
            throw new Error("Failed to get response from Gemini API: " + err.message);
        }
    }
};

export default getGeminiAPIResponse;