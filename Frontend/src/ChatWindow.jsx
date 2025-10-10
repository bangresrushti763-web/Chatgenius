import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import VoiceInput from "./components/VoiceInput.jsx";
import FileUpload from "./components/FileUpload.jsx";
import ChartGenerator from "./components/ChartGenerator.jsx";
import ImageGenerator from "./components/ImageGenerator.jsx";

function ChatWindow({ onLogout }) {
    const { prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [showChartGenerator, setShowChartGenerator] = useState(false);
    const [showImageGenerator, setShowImageGenerator] = useState(false);
    const [selectedModel, setSelectedModel] = useState("gemini"); // Default to Gemini
    const [darkMode, setDarkMode] = useState(true);
    const [notifications, setNotifications] = useState(true);
    const [autoSave, setAutoSave] = useState(true);

    const getReply = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setNewChat(false);

        console.log("message ", prompt, " threadId ", currThreadId);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
                // Removed model parameter as we're only using Gemini
            })
        };

        try {
            const response = await fetch("http://localhost:8080/api/chat", options);
            
            // Handle authentication errors
            if (response.status === 401) {
                console.log("Unauthorized access - token may be invalid or expired");
                if (onLogout) {
                    onLogout(); // Trigger logout if provided
                }
                setLoading(false);
                return;
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const res = await response.json();
            console.log(res);
            setReply(res.reply);
        } catch (err) {
            console.log("Error getting reply:", err);
            // Handle network errors or other issues
        }
        setLoading(false);
    }

    //Append new chat to prevChats
    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                }, {
                    role: "assistant",
                    content: reply
                }]
            ));
        }

        setPrompt("");
    }, [reply]);


    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    const handleVoiceInput = (transcript) => {
        setPrompt(transcript);
        // Auto-submit the voice input
        setTimeout(() => {
            getReply();
        }, 100);
    }

    const handleFileUpload = (content, fileName) => {
        // Add context about the uploaded file
        const fileContext = `File "${fileName}" content:\n${content}`;
        setPrompt(fileContext);
        setShowFileUpload(false);
        // Auto-submit the file content
        setTimeout(() => {
            getReply();
        }, 100);
    }

    const handleChartGenerated = (chartData) => {
        // Convert chart data to a textual representation that can be sent to the chat
        const chartText = `Chart data: ${chartData.map(item => `${item.label}:${item.value}`).join(' ')}`;
        setPrompt(chartText);
        setShowChartGenerator(false);
        // Auto-submit the chart data
        setTimeout(() => {
            getReply();
        }, 100);
    }

    const handleImageGenerated = (imageData) => {
        // For now, we'll just show a message about the image
        const imageMessage = `Here's an image based on your prompt: "${imageData.message}"`;
        setPrompt(imageMessage);
        setShowImageGenerator(false);
        // Auto-submit the image message
        setTimeout(() => {
            getReply();
        }, 100);
    }

    const handleLogout = () => {
        setIsOpen(false);
        if (onLogout) {
            onLogout();
        }
    }

    // Removed handleModelChange function as we're only using Gemini

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        // In a real implementation, you would apply the theme change here
        // For now, we'll just show a message
        console.log(`Dark mode ${!darkMode ? 'enabled' : 'disabled'}`);
    };

    const toggleNotifications = () => {
        setNotifications(!notifications);
        console.log(`Notifications ${!notifications ? 'enabled' : 'disabled'}`);
    };

    const toggleAutoSave = () => {
        setAutoSave(!autoSave);
        console.log(`Auto-save ${!autoSave ? 'enabled' : 'disabled'}`);
    };

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>Chatgenius <i className="fa-solid fa-robot"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen &&
                <div className="dropDown">
                    <div className="dropDownSection">
                        <div className="dropDownHeader">Settings</div>
                        <div className="dropDownItem" onClick={toggleDarkMode}>
                            <i className={`fa-solid fa-${darkMode ? 'sun' : 'moon'}`}></i>
                            {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </div>
                        <div className="dropDownItem" onClick={toggleNotifications}>
                            <i className={`fa-solid fa-bell${notifications ? '' : '-slash'}`}></i>
                            Notifications {notifications ? 'On' : 'Off'}
                        </div>
                        <div className="dropDownItem" onClick={toggleAutoSave}>
                            <i className="fa-solid fa-save"></i>
                            Auto-save {autoSave ? 'On' : 'Off'}
                        </div>
                    </div>
                    
                    <div className="dropDownSection">
                        <div className="dropDownHeader">Tools</div>
                        <div className="dropDownItem" onClick={() => setShowFileUpload(true)}>
                            <i className="fa-solid fa-file-arrow-up"></i> Upload File
                        </div>
                        <div className="dropDownItem" onClick={() => setShowChartGenerator(true)}>
                            <i className="fa-solid fa-chart-simple"></i> Generate Chart
                        </div>
                        <div className="dropDownItem" onClick={() => setShowImageGenerator(true)}>
                            <i className="fa-solid fa-image"></i> Generate Image
                        </div>
                    </div>
                    
                    <div className="dropDownSection">
                        <div className="dropDownHeader">Account</div>
                        <div className="dropDownItem"><i className="fa-solid fa-crown"></i> Upgrade plan</div>
                        <div className="dropDownItem" onClick={handleLogout}>
                            <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
                        </div>
                    </div>
                </div>
            }
            <div className="chatWindowContent">
                {
                    showFileUpload && (
                        <div className="fileUploadModal">
                            <div className="fileUploadContent">
                                <span className="closeButton" onClick={() => setShowFileUpload(false)}>×</span>
                                <FileUpload onFileUpload={handleFileUpload} />
                            </div>
                        </div>
                    )
                }
                {
                    showChartGenerator && (
                        <div className="chartGeneratorModal">
                            <div className="chartGeneratorContent">
                                <span className="closeButton" onClick={() => setShowChartGenerator(false)}>×</span>
                                <h3>Chart Generator</h3>
                                <ChartGenerator onDataGenerated={handleChartGenerated} />
                            </div>
                        </div>
                    )
                }
                {
                    showImageGenerator && (
                        <div className="chartGeneratorModal">
                            <div className="chartGeneratorContent">
                                <span className="closeButton" onClick={() => setShowImageGenerator(false)}>×</span>
                                <ImageGenerator onImageGenerated={handleImageGenerated} />
                            </div>
                        </div>
                    )
                }
                <Chat></Chat>

                <ScaleLoader color="#339cff" loading={loading} />
            </div>

            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
                    />

                    <VoiceInput onTranscript={handleVoiceInput} />
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                    Chatgenius can make mistakes. Check important info. See Cookie Preferences.
                </p>
                <div className="model-indicator">
                    <i className="fa-solid fa-microchip"></i> Using: Gemini (1.5 Flash)
                </div>
            </div>
        </div>
    )
}

export default ChatWindow;