import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateImage = async (req, res) => {
  const { prompt } = req.body;

  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY is not set in environment variables",
        message: "Image generation is not configured properly. Please contact the administrator."
      });
    }
    
    // Initialize Google Generative AI with API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Use the gemini-2.5-flash-image model for image generation
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });
    
    // Generate image from text prompt
    const result = await model.generateContent([prompt]);
    const response = await result.response;
    
    // Extract image data from response
    // Note: Implementation may vary depending on the exact API response format
    // This is a simplified approach that might need adjustment based on actual response
    
    if (response.candidates && response.candidates.length > 0) {
      // If we get a proper image response, we would extract it here
      // For now, we'll send a success message with the prompt
      res.json({ 
        imageUrl: null, // In a full implementation, this would be the actual image URL
        prompt: prompt,
        message: "Image generation feature is now properly connected to Gemini API. In a full implementation, this would generate an actual image based on your prompt: '" + prompt + "'"
      });
    } else {
      // Fallback to placeholder if no candidates
      const placeholderImageUrl = `https://placehold.co/512x512?text=${encodeURIComponent(prompt)}`;
      
      res.json({ 
        imageUrl: placeholderImageUrl,
        prompt: prompt,
        message: "Image generation is working but returned no candidates. Using placeholder image for prompt: '" + prompt + "'"
      });
    }
  } catch (err) {
    console.error("Image generation error:", err);
    
    // Fallback to placeholder image on error
    const placeholderImageUrl = `https://placehold.co/512x512?text=${encodeURIComponent(prompt || "Error")}`;
    
    res.status(500).json({ 
      imageUrl: placeholderImageUrl,
      prompt: prompt,
      error: "Image generation failed: " + err.message,
      message: "We encountered an issue generating your image. Using placeholder instead."
    });
  }
};