import { useState } from "react";
import axios from "axios";
import "./index.css";
import "./login.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username.trim()) return;

    try {
      const res = await axios.post("http://localhost:5000/auth", {
      user_name: username,
      });

      const user = res.data;

      // Optional: check backend response
      if (!user || !user.id) {
        setError("Invalid login response from server.");
        return;
      }

      // Save user locally
      localStorage.setItem("user", JSON.stringify(user));

      // Notify parent to show App
      onLogin(user);
    } catch (err) {
          if (err.response) {
            // Server responded with status code out of 2xx range
            console.error("Backend error:", err.response.data);
            setError(err.response.data.error || "Server returned an error.");
          } else if (err.request) {
            // Request was made but no response received (network error)
            console.error("Network error:", err.message);
            setError("Cannot reach server. Check your connection or if the server is running.");
          } else {
            // Something else happened
            console.error("Error", err.message);
            setError("An unexpected error occurred.");
          }
        }

 };

  return (
    <div className="login-container">
      <img
        src="/background_day.png"
        className="bg-img"
        alt="background"
      />
      <div className="login-form">
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <button onClick={handleLogin}>Login</button>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}


/** 
function Login() {
  return (
    <div style={{ color: "white", fontSize: "2rem" }}>
      <h1>Login Screen</h1>
      <p>This is where the user will log in.</p>
    </div>
  );
}

export default Login;

*/ 