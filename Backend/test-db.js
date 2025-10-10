import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.resolve(__dirname, ".env");
dotenv.config({ path: envPath });

console.log("Attempting to connect to MongoDB...");

const connectDB = async () => {
    try {
        console.log("MONGODB_URI:", process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 50) + "..." : "Not found");
        
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("✅ Connected to MongoDB successfully!");
        
        // Try to fetch users
        const NewUser = (await import("./models/NewUser.js")).default;
        const users = await NewUser.find({});
        console.log(`Found ${users.length} users in the database`);
        
        if (users.length > 0) {
            console.log("Sample user:", {
                id: users[0]._id,
                username: users[0].username,
                createdAt: users[0].createdAt
            });
        }
        
        await mongoose.connection.close();
        console.log("Disconnected from MongoDB");
    } catch (err) {
        console.error("❌ Failed to connect to MongoDB:", err.message);
        console.error("Error code:", err.code);
    }
};

connectDB();