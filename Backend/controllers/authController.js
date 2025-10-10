import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  const { username, password } = req.body;
  // Debug: log incoming registration attempts (do not log full password in production)
  try {
    console.log('Incoming register request - username:', username, 'passwordLength:', password ? password.length : 0);
  } catch (logErr) {
    // ignore logging errors
  }
  
  // Validate input
  if (!username || !password) {
    console.log('Register validation failed: missing username or password');
    return res.status(400).json({ error: "Username and password are required" });
  }
  
  // Validate username length
  if (username.length < 3) {
    console.log('Register validation failed: username too short', username);
    return res.status(400).json({ error: "Username must be at least 3 characters long" });
  }
  
  if (username.length > 30) {
    console.log('Register validation failed: username too long', username);
    return res.status(400).json({ error: "Username must be no more than 30 characters long" });
  }
  
  // Validate password length
  if (password.length < 6) {
    console.log('Register validation failed: password too short');
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { username: username },
        { email: username } // Allow username to be used as email for login
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }
    
    const hashed = await bcrypt.hash(password, 10);
    // Create user with email field explicitly set to null to avoid index conflicts
    const user = await User.create({ 
      username, 
      email: null,
      password: hashed 
    });
    res.status(201).json({ success: true, userId: user._id });
  } catch (err) {
    console.error("Registration error:", err);
    if (err.code === 11000) {
      // MongoDB duplicate key error
      res.status(400).json({ error: "Username already taken" });
    } else if (err.name === 'ValidationError') {
      // Mongoose validation error
      const messages = Object.values(err.errors).map(e => e.message);
      res.status(400).json({ error: messages.join(', ') });
    } else {
      res.status(500).json({ error: "Registration failed" });
    }
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  
  // Validate input
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  
  try {
    // Allow login with either username or email
    const user = await User.findOne({ 
      $or: [
        { username: username },
        { email: username }
      ]
    });
    
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured in environment variables");
      return res.status(500).json({ error: "Authentication configuration error" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};