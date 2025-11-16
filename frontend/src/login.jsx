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

      <div className="content">
        <div className="login-form">
          <h1>Login</h1>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <button onClick={handleLogin}>Login</button>
          {error && <p>{error}</p>}
        </div>
      </div>
    </div>
  );
}
