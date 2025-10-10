import express from "express";
import mongoose from "mongoose";
import Thread from "../models/Thread.js";
import getGeminiAPIResponse from "../utils/gemini.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Helper function to check if MongoDB is connected
const isMongoDBConnected = () => {
    return mongoose.connection.readyState === 1;
};

// Apply authentication middleware to all routes
router.use(verifyToken);

//test
router.post("/test", async(req, res) => {
    try {
        if (isMongoDBConnected()) {
            const thread = new Thread({
                threadId: "abc",
                userId: req.userId,
                title: "Testing New Thread2"
            });

            const response = await thread.save();
            res.send(response);
        } else {
            // Fallback to in-memory storage
            res.send({threadId: "abc", title: "Testing New Thread2", message: "Using in-memory storage"});
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to save in DB"});
    }
});

//Get all threads for the authenticated user
router.get("/thread", async(req, res) => {
    try {
        if (isMongoDBConnected()) {
            const threads = await Thread.find({userId: req.userId}).sort({updatedAt: -1});
            //descending order of updatedAt...most recent data on top
            res.json(threads);
        } else {
            // Fallback to in-memory storage
            const threads = Array.from(req.inMemoryThreads.values())
                .filter(thread => thread.userId === req.userId)
                .map(thread => ({
                    threadId: thread.threadId,
                    title: thread.title,
                    updatedAt: thread.updatedAt
                }))
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            res.json(threads);
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

router.get("/thread/:threadId", async(req, res) => {
    const {threadId} = req.params;

    try {
        if (isMongoDBConnected()) {
            const thread = await Thread.findOne({threadId, userId: req.userId});

            if(!thread) {
                res.status(404).json({error: "Thread not found"});
            }

            res.json(thread.messages);
        } else {
            // Fallback to in-memory storage
            const thread = req.inMemoryThreads.get(threadId);
            if (!thread || thread.userId !== req.userId) {
                res.status(404).json({error: "Thread not found"});
            }
            res.json(thread.messages);
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch chat"});
    }
});

router.delete("/thread/:threadId", async (req, res) => {
    const {threadId} = req.params;

    try {
        if (isMongoDBConnected()) {
            const deletedThread = await Thread.findOneAndDelete({threadId, userId: req.userId});

            if(!deletedThread) {
                res.status(404).json({error: "Thread not found"});
            }

            res.status(200).json({success : "Thread deleted successfully"});
        } else {
            // Fallback to in-memory storage
            const thread = req.inMemoryThreads.get(threadId);
            if (!thread || thread.userId !== req.userId) {
                res.status(404).json({error: "Thread not found"});
            }
            req.inMemoryThreads.delete(threadId);
            res.status(200).json({success : "Thread deleted successfully"});
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to delete thread"});
    }
});

router.post("/chat", async(req, res) => {
    const {threadId, message} = req.body; // Removed model parameter

    if(!threadId || !message) {
        res.status(400).json({error: "missing required fields"});
    }

    try {
        // Use only Gemini API
        const getAPIResponse = getGeminiAPIResponse;

        if (isMongoDBConnected()) {
            let thread = await Thread.findOne({threadId, userId: req.userId});

            if(!thread) {
                //create a new thread in Db
                thread = new Thread({
                    threadId,
                    userId: req.userId,
                    title: message,
                    messages: [{role: "user", content: message}]
                });
            } else {
                thread.messages.push({role: "user", content: message});
            }

            const assistantReply = await getAPIResponse(message);

            thread.messages.push({role: "assistant", content: assistantReply});
            thread.updatedAt = new Date();

            await thread.save();
            res.json({reply: assistantReply});
        } else {
            // Fallback to in-memory storage
            let thread = req.inMemoryThreads.get(threadId);
            
            if (!thread || thread.userId !== req.userId) {
                // Create a new thread in memory
                thread = {
                    threadId,
                    userId: req.userId,
                    title: message,
                    messages: [{role: "user", content: message}],
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                req.inMemoryThreads.set(threadId, thread);
            } else {
                thread.messages.push({role: "user", content: message});
                thread.updatedAt = new Date();
            }

            const assistantReply = await getAPIResponse(message);
            
            thread.messages.push({role: "assistant", content: assistantReply});
            thread.updatedAt = new Date();
            
            req.inMemoryThreads.set(threadId, thread);
            res.json({reply: assistantReply});
        }
    } catch(err) {
        console.log(err);
        
        // Provide more user-friendly error messages
        if (err.message.includes("API key")) {
            res.status(401).json({error: "API key error: " + err.message});
        } else if (err.message.includes("Rate limit")) {
            res.status(429).json({error: "Rate limit exceeded: " + err.message});
        } else {
            res.status(500).json({error: "Something went wrong: " + err.message});
        }
    }
});

export default router;