import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";

function Sidebar({ userId }) {
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    // Handle unauthorized access
                    console.log("Unauthorized access - token may be invalid or expired");
                    // You might want to redirect to login page here
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const res = await response.json();
            
            // Check if res is an array before mapping
            if (Array.isArray(res)) {
                const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
                setAllThreads(filteredData);
            } else {
                console.error("Expected array but received:", res);
                // Set to empty array to prevent further errors
                setAllThreads([]);
            }
        } catch(err) {
            console.log("Error fetching threads:", err);
            // Set to empty array on error to prevent further errors
            setAllThreads([]);
        }
    };

    useEffect(() => {
        if (userId) {
            getAllThreads();
        }
    }, [userId, currThreadId])


    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    console.log("Unauthorized access - token may be invalid or expired");
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch(err) {
            console.log("Error changing thread:", err);
        }
    }   

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    console.log("Unauthorized access - token may be invalid or expired");
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const res = await response.json();
            console.log(res);

            //updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId) {
                createNewChat();
            }

        } catch(err) {
            console.log("Error deleting thread:", err);
        }
    }

    return (
        <section className="sidebar">
            <div className="sidebar-header">
                <img src="/chatgenius-logo.svg" alt="ChatGenius Logo" className="chatgenius-logo-img" onError={(e) => {
                    // Fallback if the image fails to load
                    e.target.src = "/chatgenius-icon.svg";
                }} />
            </div>
            
            <button onClick={createNewChat}>
                <span><i className="fa-solid fa-plus"></i> New Chat</span>
            </button>


            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx} 
                            onClick={(e) => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted": " "}
                        >
                            <i className="fa-solid fa-message"></i> {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation(); //stop event bubbling
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                }
            </ul>
 
            <div className="sign">
                <p>Made by Srushti Bangre ♥</p>
            </div>
        </section>
    )
}

export default Sidebar;