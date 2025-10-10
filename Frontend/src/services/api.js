import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Create a separate axios instance for auth requests without interceptors
const authClient = axios.create({
  baseURL: API_BASE_URL,
});

// File upload service
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Auth service - using authClient without interceptors
export const registerUser = async (username, password) => {
  try {
    console.log("Sending registration request to:", `${API_BASE_URL}/auth/register`);
    console.log("Registration data:", { username, password });
    
    // Validate data before sending
    if (!username || !password) {
      throw new Error("Username and password are required");
    }
    
    if (username.length < 3) {
      throw new Error("Username must be at least 3 characters long");
    }
    
    if (username.length > 30) {
      throw new Error("Username must be no more than 30 characters long");
    }
    
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }
    
    const response = await authClient.post("/auth/register", { username, password });
    console.log("Registration response:", response.data);
    return response.data;
  } catch (error) {
    // If server returned response, log full body for debugging
    if (error.response) {
      console.error("Registration API error - response data:", error.response.data);
      console.error("Registration API error - status:", error.response.status);
    } else if (error.request) {
      console.error("Registration API error - no response received, request:", error.request);
    } else {
      console.error("Registration API error:", error.message);
    }
    throw error;
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await authClient.post("/auth/login", { username, password });
    return response.data;
  } catch (error) {
    console.error("Login API error:", error);
    // Re-throw the error so it can be handled by the calling component
    throw error;
  }
};

// Request interceptor to add authorization header for protected routes
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - token might be invalid or expired
      console.log("Authentication error:", error.response.data);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      // Optionally redirect to login page
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;