# 🤖 ChatGenius - AI-Powered Conversational Assistant

**ChatGenius** is a full-stack generative AI application powered by the Google Gemini API. It features a responsive, state-driven interface capable of maintaining multi-turn conversations, code generation, and complex query resolution.

Unlike typical client-side wrappers, this project utilizes a **secure Node.js proxy server** to handle API requests, ensuring sensitive API keys remain hidden from the client and enabling rate limiting and error handling on the backend.

## 🚀 Key Features

* **Secure Backend Proxy:** All API requests are routed through an Express.js server to prevent API key exposure and manage Cross-Origin Resource Sharing (CORS) securely.
* **Multi-Turn Context:** Maintains conversation history state effectively, allowing the AI to "remember" previous inputs for a natural dialogue flow.
* **Markdown Rendering:** Integrated support for rendering code blocks, bold text, and lists within the chat interface, optimized for developer queries.
* **Robust Error Handling:** Implemented timeout management and graceful error fallbacks to ensure 99% system availability during high latency periods.
* **Responsive UI:** Mobile-first design ensuring a seamless experience across devices.

## 🛠️ Tech Stack

* **Frontend:** React.js, Context API (State Management), CSS Modules
* **Backend:** Node.js, Express.js
* **AI Engine:** Google Gemini API
* **Utilities:** React-Markdown, Axios

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/chatgenius.git](https://github.com/yourusername/chatgenius.git)
    cd chatgenius
    ```

2.  **Install Dependencies**
    ```bash
    # Install server dependencies
    cd server
    npm install

    # Install client dependencies
    cd ../client
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the `server` directory and add your API key:
    ```env
    PORT=5000
    GEMINI_API_KEY=your_google_gemini_api_key
    ```

4.  **Run the Application**
    ```bash
    # Run backend (from server folder)
    node index.js

    # Run frontend (from client folder)
    npm start
    ```

## 🔮 Future Improvements

* Implementation of user authentication (OAuth) to save chat history to a database (MongoDB).
* Voice-to-text integration for voice commands.
* Stream response handling for faster "typewriter" effect output.

---
**Author:** Srushti Bangre
