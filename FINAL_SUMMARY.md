# ChatGenius - Gemini AI Chat Application

Congratulations! You now have a fully functional AI chat application based on the ChatGenius repository. Here's a summary of what has been set up and how to use it.

## Application Overview

This is a MERN (MongoDB, Express.js, React, Node.js) stack application that replicates ChatGPT functionality using the Google Gemini API. The application features:

- Real-time chat interface with typing simulation
- Thread-based conversation history
- Ability to create new chats and delete existing ones
- Responsive design that works on desktop and mobile devices

## System Architecture

### Backend (Node.js/Express)
- Runs on port 8080
- MongoDB integration for persistent storage
- Google Gemini API integration for generating responses
- RESTful API endpoints for chat operations

### Frontend (React/Vite)
- Runs on port 5173
- Modern UI with chat bubbles for user and AI messages
- Syntax highlighting for code snippets in responses
- Sidebar for managing conversation threads

## Current Status

✅ Backend server running on http://localhost:8080
✅ Frontend application running on http://localhost:5173
✅ MongoDB connection established
✅ In-memory fallback implemented for database failures
✅ All dependencies installed

## How to Use the Application

1. Open your browser and navigate to http://localhost:5173
2. Type your message in the input box at the bottom of the screen
3. Press Enter or click the send button to submit your message
4. The AI response will appear in the chat window with a typing animation
5. Previous conversations are saved in the sidebar
6. Click the "+" button to start a new conversation
7. Click on any previous conversation in the sidebar to load it
8. Use the trash icon to delete unwanted conversations

## Next Steps

To make the application fully functional, you need to:

1. **Get a Google Gemini API Key:**
   - Sign up at https://ai.google.dev/
   - Navigate to API Keys section
   - Create a new API key
   - Replace `your_gemini_api_key_here` in `Backend/.env` with your actual key

2. **(Optional) Set up MongoDB Atlas for cloud storage:**
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create a new cluster
   - Get your connection string
   - Update the MONGODB_URI in `Backend/.env`

## Project Structure

```
ChatGenius/
├── Backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── server.js        # Main server file
│   └── .env             # Environment variables
├── Frontend/
│   ├── src/
│   │   ├── assets/      # Images and static assets
│   │   ├── App.jsx      # Main application component
│   │   ├── Sidebar.jsx  # Conversation history sidebar
│   │   ├── ChatWindow.jsx # Main chat interface
│   │   └── Chat.jsx     # Chat message display
│   └── package.json     # Frontend dependencies
└── SETUP_INSTRUCTIONS.md # Detailed setup guide
```

## Commands for Managing the Application

### To restart the backend server:
```bash
cd Backend
npm start
```

### To restart the frontend application:
```bash
cd Frontend
npm run dev
```

### To install additional dependencies:
```bash
# For backend
cd Backend
npm install package-name

# For frontend
cd Frontend
npm install package-name
```

## Troubleshooting

1. **If the application doesn't start:**
   - Make sure you're in the correct directory
   - Check that Node.js is installed (node --version)
   - Ensure ports 8080 and 5173 are not being used by other applications

2. **If you get MongoDB connection errors:**
   - The application will automatically fall back to in-memory storage
   - Data will be lost when the server restarts
   - For persistent storage, set up MongoDB Atlas

3. **If you get Gemini API errors:**
   - Verify your API key is correct
   - Check that you have sufficient credits in your Google AI account
   - Ensure your API key has the correct permissions

## Customization Options

You can customize the application by modifying:

1. **Styling:** Edit the CSS files in `Frontend/src/`
2. **UI Components:** Modify the JSX files in `Frontend/src/`
3. **API Endpoints:** Edit the route files in `Backend/routes/`
4. **Database Models:** Modify the model files in `Backend/models/`

## Credits

This application is based on the ChatGenius project. Modifications have been made to improve error handling and add fallback functionality.

Enjoy your new Gemini AI chat application!