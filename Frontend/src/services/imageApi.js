import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const generateImage = async (prompt) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/image/generate`, { prompt });
    return response.data;
  } catch (error) {
    console.error("Image generation API error:", error);
    throw error;
  }
};