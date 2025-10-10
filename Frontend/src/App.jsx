import './App.css';
import { useState, useEffect } from 'react';
import NewAuthPage from "./components/NewAuthPage.jsx";
import ProtectedChat from "./components/ProtectedChat.jsx";

function App() {
  const [userId, setUserId] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    if (token && storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleAuthSuccess = (id) => {
    setUserId(id);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("savedUsername");
    setUserId(null);
  };

  // If user is logged in, show the protected chat
  if (userId) {
    return <ProtectedChat userId={userId} onLogout={handleLogout} />;
  }

  // Otherwise, show the new authentication page
  return (
    <div className="auth-app">
      <NewAuthPage onAuthSuccess={handleAuthSuccess} />
    </div>
  );
}

export default App;