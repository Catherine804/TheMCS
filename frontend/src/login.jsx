import { useState } from "react";
import axios from "axios";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");

  const handleLogin = async () => {
    if (!username.trim()) return;

    try {
      const res = await axios.post("http://localhost:3000/auth", {
        user_name: username,
      });

      const user = res.data;

      // Save user to browser
      localStorage.setItem("user", JSON.stringify(user));

      // Notify parent component
      onLogin(user);
    } catch (error) {
      console.error("Login error:", error);
      alert("Could not log in.");
    }
  };

  return (
    <div style={{ color: "white", fontSize: "1.5rem" }}>
      <h1>Login</h1>

      <input
        style={{
          padding: "10px",
          fontSize: "1.2rem",
          borderRadius: "8px",
          marginRight: "10px",
        }}
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          fontSize: "1.2rem",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Login
      </button>
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