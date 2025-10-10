import React, { useState } from "react";
import { generateImage } from "../services/imageApi";

const ImageGenerator = ({ onImageGenerated }) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt for the image");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await generateImage(prompt);
      if (onImageGenerated) {
        onImageGenerated(data);
      }
    } catch (err) {
      setError("Failed to generate image. Please try again.");
      console.error("Image generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <div className="image-generator">
      <h3>Text to Image</h3>
      <div className="image-input-container">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe your image... (e.g. 'A robot riding a bicycle on Mars')"
          className="image-input"
        />
        <button 
          onClick={handleGenerate} 
          disabled={loading}
          className="generate-button"
        >
          {loading ? "Generating..." : "Generate Image"}
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ImageGenerator;