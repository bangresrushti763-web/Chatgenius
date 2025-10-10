# ChatGenius Setup Instructions

## Prerequisites
1. Node.js (version 14 or higher)
2. MongoDB (local installation or MongoDB Atlas account)
3. Google Gemini API key

## Installation Steps

### 1. Install Dependencies
Backend dependencies have already been installed.
Frontend dependencies have already been installed.

### 2. Configure Environment Variables
The backend .env file has been created at `Backend/.env` with the following variables:
- MONGODB_URI=mongodb://localhost:27017/chatgenius
- GEMINI_API_KEY=your_gemini_api_key_here
- JWT_SECRET=chatgenius_secret_key_2025

### 3. MongoDB Setup Options

#### Option A: Local MongoDB Installation
1. Install MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. The application will automatically connect to your local MongoDB instance

#### Option B: MongoDB Atlas (Cloud)
1. Sign up for a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string from the Atlas dashboard
4. Update the MONGODB_URI in the Backend/.env file with your Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatgenius?retryWrites=true&w=majority
   ```

#### Option C: In-Memory Storage (Fallback)
If MongoDB is not available, the application will automatically use in-memory storage as a fallback. Note that data will be lost when the server restarts.

### 4. Google Gemini API Key Setup
1. Sign up for a Google AI account at https://ai.google.dev/
2. Navigate to the API keys section
3. Create a new API key
4. Copy the API key and replace `your_gemini_api_key_here` in the Backend/.env file with your actual API key

### 5. Running the Application

#### Start the Backend Server
```bash
cd Backend
npm start
```

#### Start the Frontend Application
```bash
cd Frontend
npm run dev
```

The application will be available at http://localhost:5173

## Troubleshooting

1. If you encounter connection issues with MongoDB, make sure the MongoDB service is running
2. If you get Gemini API errors, verify your API key is correct and you have sufficient credits
3. If the frontend fails to connect to the backend, ensure the backend server is running on port 8080