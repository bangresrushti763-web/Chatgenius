import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import NewUser from "../models/NewUser.js";

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
    
    // Validate username length
    if (username.length < 3) {
      return res.status(400).json({ error: "Username must be at least 3 characters long" });
    }
    
    if (username.length > 30) {
      return res.status(400).json({ error: "Username must be no more than 30 characters long" });
    }
    
    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    
    // Check if user already exists
    const existingUser = await NewUser.findOne({ 
      username: username
    });
    
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken. Please choose a different username." });
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user
    const newUser = new NewUser({ 
      username, 
      password: hashedPassword 
    });
    
    // Save user to database
    const savedUser = await newUser.save();
    
    // Return success response
    res.status(201).json({ 
      success: true, 
      message: "User registered successfully",
      userId: savedUser._id 
    });
  } catch (err) {
    console.error("Registration error:", err);
    
    // Handle specific MongoDB errors
    if (err.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ error: "Username already taken. Please choose a different username." });
    } else if (err.name === 'ValidationError') {
      // Mongoose validation error
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    
    // General error
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
    
    // Find user by username
    const user = await NewUser.findOne({ username });
    
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured in environment variables");
      return res.status(500).json({ error: "Authentication configuration error" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ 
      success: true,
      token, 
      userId: user._id,
      username: user.username
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await NewUser.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Failed to retrieve profile" });
  }
};