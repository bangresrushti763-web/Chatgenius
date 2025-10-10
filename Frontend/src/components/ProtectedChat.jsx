import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar.jsx";
import ChatWindow from "../ChatWindow.jsx";
import { MyContext } from "../MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

const ProtectedChat = ({ userId, onLogout }) => {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); //stores all chats of curr threads
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads
  }; 

  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
        <Sidebar userId={userId} />
        <ChatWindow onLogout={onLogout} />
      </MyContext.Provider>
    </div>
  );
};

export default ProtectedChat;