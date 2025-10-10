import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // Log incoming request for debugging
  console.log("Auth middleware called. Auth header:", authHeader ? "Present" : "Missing");
  
  // Check if authorization header exists
  if (!authHeader) {
    console.log("No authorization header found");
    return res.status(401).json({ error: "Unauthorized: No authorization header" });
  }
  
  // Check if it's a Bearer token
  const tokenParts = authHeader.split(" ");
  if (tokenParts[0] !== "Bearer" || !tokenParts[1]) {
    console.log("Invalid token format:", authHeader);
    return res.status(401).json({ error: "Unauthorized: Invalid token format" });
  }
  
  const token = tokenParts[1];
  console.log("Token extracted, verifying...");
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified successfully. User ID:", decoded.userId);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log("Token verification failed:", err.name, err.message);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    } else {
      return res.status(401).json({ error: "Unauthorized: Token verification failed" });
    }
  }
};