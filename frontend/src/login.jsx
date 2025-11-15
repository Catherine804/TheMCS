import { useState } from "react";
import axios from "axios";
import "./index.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username.trim()) return;

    try {
      const res = await axios.post("http://localhost:3000/auth", {
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
      console.error(err);
      setError("Could not log in. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
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