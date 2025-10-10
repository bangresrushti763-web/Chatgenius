import React, { useState, useEffect } from "react";
import { registerUser, loginUser } from "../services/api";

const NewAuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Pre-fill username if "Remember me" was selected
  useEffect(() => {
    const rememberMe = localStorage.getItem("rememberMe");
    if (rememberMe === "true") {
      const savedUsername = localStorage.getItem("savedUsername");
      if (savedUsername) {
        setFormData(prev => ({ ...prev, username: savedUsername }));
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Calculate password strength when password changes
    if (name === "password") {
      let strength = 0;
      if (value.length >= 6) strength += 1;
      if (/[A-Z]/.test(value)) strength += 1;
      if (/[0-9]/.test(value)) strength += 1;
      if (/[^A-Za-z0-9]/.test(value)) strength += 1;
      setPasswordStrength(strength);
    }

    // Clear error when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const getPasswordStrengthClass = () => {
    if (formData.password.length === 0) return "";
    if (passwordStrength <= 1) return "strength-weak";
    if (passwordStrength <= 2) return "strength-medium";
    return "strength-strong";
  };

  const validateForm = () => {
    // Clear previous errors
    setError("");

    if (!formData.username || !formData.password) {
      setError("Please fill in all required fields");
      return false;
    }

    // Validate username length according to backend requirements
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters long");
      return false;
    }

    if (formData.username.length > 30) {
      setError("Username must be no more than 30 characters long");
      return false;
    }

    if (!isLogin) {
      // Registration specific validations
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }

      if (formData.password.length < 6) {
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
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        // Login logic
        const { token, userId } = await loginUser(formData.username, formData.password);
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);

        // Handle "Remember me" functionality
        if (formData.rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("savedUsername", formData.username);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("savedUsername");
        }

        onAuthSuccess(userId);
      } else {
        // Registration logic
        const data = await registerUser(formData.username, formData.password);

        if (data.success) {
          setSuccess("Registration successful! Please log in.");
          // Switch to login mode after successful registration
          setTimeout(() => {
            setIsLogin(true);
            setFormData(prev => ({
              ...prev,
              password: "",
              confirmPassword: ""
            }));
          }, 2000);
        } else {
          setError(data.error || "Registration failed");
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
      // Provide more specific error messages based on the error type
      if (err.response) {
        // Server responded with error status
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
    setSuccess("");
    setFormData(prev => ({
      ...prev,
      password: "",
      confirmPassword: ""
    }));
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
      <p style={{ textAlign: 'center', color: '#aaaaaa', marginBottom: '1.5rem' }}>
        {isLogin ? "Sign in to continue your conversation" : "Sign up to start chatting with AI"}
      </p>

      {(error || success) && (
        <div className={error ? "error-message" : "success-message"}>
          {error || success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-input-container">
          <i className="auth-input-icon">👤</i>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="auth-input"
            required
          />
        </div>

        <div className="auth-input-container">
          <i className="auth-input-icon">🔒</i>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
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
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
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
              name="rememberMe"
              checked={formData.rememberMe || false}
              onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
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

export default NewAuthPage;