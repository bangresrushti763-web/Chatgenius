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

console.log("Environment variables loaded:");
console.log("- MONGODB_URI:", process.env.MONGODB_URI ? "✓ Present" : "✗ Missing");
console.log("- JWT_SECRET:", process.env.JWT_SECRET ? "✓ Present" : "✗ Missing");

// Import models after dotenv config
const NewUser = (await import("./models/NewUser.js")).default;

const checkUsers = async () => {
    try {
        console.log("\nAttempting to connect to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("✅ Connected to MongoDB successfully!");
        
        // Count users
        const userCount = await NewUser.countDocuments();
        console.log(`\nFound ${userCount} users in the database`);
        
        if (userCount > 0) {
            // Get all users (limit to 5 for display)
            const users = await NewUser.find({}).limit(5);
            console.log("\nUsers in database:");
            users.forEach((user, index) => {
                console.log(`${index + 1}. Username: ${user.username}, Created: ${user.createdAt}`);
            });
        } else {
            console.log("\nNo users found in database. You'll need to register a user first.");
        }
        
        await mongoose.connection.close();
        console.log("\nDisconnected from MongoDB");
    } catch (err) {
        console.error("❌ Error:", err.message);
        if (err.code) {
            console.error("Error code:", err.code);
        }
    }
};

checkUsers();