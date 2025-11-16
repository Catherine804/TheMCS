// Login.jsx
import { useState } from "react";
import axios from "axios";
import "./App.css";     // shared layout & background
import "./login.css";   // login-specific form styles

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/auth", {
        user_name: username,
        password: password,
      });

      const user = res.data;

      // Optional: check backend response
      if (!user || !user.id) {
        setError("Invalid login response from server.");
        return;
      }

    
    sessionStorage.setItem("user", JSON.stringify(user));

      // Notify parent to show App
      onLogin(user);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "Server returned an error.");
      } else if (err.request) {
        setError("Cannot reach server. Check your connection or if the server is running.");
      } else {
        setError("An unexpected error occurred.");
      }
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      {/* Full-screen background */}
      <img
        src="/background_day.png"
        className="background-image"
        alt="background"
      />

      <div className="content" style={{ paddingTop: "40px" }}>
        {/* Logo above the login form */}
        <img
          src="/LOGO-removebg-preview.png"
          alt="SheepTrack Logo"
          style={{
            width: "500px",
            height: "auto",
            marginBottom: "30px",
            filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))"
          }}
        />
        
        <div className="login-form">
          <h1 className="login-title">Welcome to Sheep Track</h1>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="login-input"
          />
          <button onClick={handleLogin} className="login-button">
            Login
          </button>
          {error && <p className="login-error">{error}</p>}
        </div>
      </div>
    </div>
  );
}
