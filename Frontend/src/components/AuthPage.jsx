import React, { useState, useEffect } from "react";
import { registerUser, loginUser } from "../services/api";

const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Pre-fill username if "Remember me" was selected
  useEffect(() => {
    const rememberMe = localStorage.getItem("rememberMe");
    if (rememberMe === "true") {
      const savedUsername = localStorage.getItem("savedUsername");
      if (savedUsername) {
        setUsername(savedUsername);
        setRememberMe(true);
      }
    }
  }, []);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    // Calculate password strength
    let strength = 0;
    if (value.length >= 6) strength += 1;
    if (/[A-Z]/.test(value)) strength += 1;
    if (/[0-9]/.test(value)) strength += 1;
    if (/[^A-Za-z0-9]/.test(value)) strength += 1;
    
    setPasswordStrength(strength);
  };

  const getPasswordStrengthClass = () => {
    if (password.length === 0) return "";
    if (passwordStrength <= 1) return "strength-weak";
    if (passwordStrength <= 2) return "strength-medium";
    return "strength-strong";
  };

  const validateForm = () => {
    // Clear previous errors
    setError("");
    
    if (!username || !password) {
      setError("Please fill in all fields");
      return false;
    }
    
    // Validate username length according to backend requirements
    if (username.length < 3) {
      setError("Username must be at least 3 characters long");
      return false;
    }
    
    if (username.length > 30) {
      setError("Username must be no more than 30 characters long");
      return false;
    }
    
    if (!isLogin) {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
      
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (isLogin) {
        // Login logic
        const { token, userId } = await loginUser(username, password);
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("savedUsername", username);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("savedUsername");
        }
        
        onAuthSuccess(userId);
      } else {
        // Registration logic
        const data = await registerUser(username, password);
        
        if (data.success) {
          // Switch to login mode after successful registration
          setIsLogin(true);
          setError("Registration successful! Please log in.");
        } else {
          setError(data.error || "Registration failed");
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
      // Provide more specific error messages based on the error type
      if (err.response) {
        // Server responded with error status
        // Try to get the specific error message from the server
        const serverError = err.response.data?.error;
        if (serverError) {
          setError(serverError);
        } else {
          setError(`${isLogin ? "Login" : "Registration"} failed. Please try again.`);
        }
      } else if (err.request) {
        // Request was made but no response received
        setError("Network error. Please check your connection and try again.");
      } else {
        // Something else happened
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setConfirmPassword("");
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
      <p style={{ textAlign: 'center', color: '#aaaaaa', marginBottom: '1.5rem' }}>
        {isLogin ? "Sign in to continue" : "Sign up to get started"}
      </p>
      
      <form onSubmit={handleSubmit} className="auth-form">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="auth-input-container">
          <i className="auth-input-icon">👤</i>
          <input 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            onKeyPress={handleKeyPress}
            className="auth-input"
            required
          />
        </div>
        
        <div className="auth-input-container">
          <i className="auth-input-icon">🔒</i>
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={handlePasswordChange} 
            onKeyPress={handleKeyPress}
            className="auth-input"
            required
          />
        </div>
        
        {!isLogin && (
          <>
            <div className="password-strength">
              <div className={`strength-meter ${getPasswordStrengthClass()}`}></div>
            </div>
            
            <div className="auth-input-container">
              <i className="auth-input-icon">🔒</i>
              <input 
                type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} 
                onKeyPress={handleKeyPress}
                className="auth-input"
                required
              />
            </div>
          </>
        )}
        
        {isLogin && (
          <div className="remember-me">
            <input 
              type="checkbox" 
              id="rememberMe" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)} 
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
        )}
        
        <button 
          type="submit"
          disabled={loading}
          className="auth-button"
        >
          <div className="auth-button-content">
            {loading ? (
              <>
                <div className="spinner"></div>
                {isLogin ? "Signing in..." : "Creating account..."}
              </>
            ) : (
              isLogin ? "Sign In" : "Sign Up"
            )}
          </div>
        </button>
      </form>
      
      <div className="auth-switch">
        <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', margin: '0' }}>
          <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
          <button onClick={toggleAuthMode} className="switch-button">
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;