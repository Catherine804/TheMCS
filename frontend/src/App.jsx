//App.jsx
import { useState } from "react";
import axios from "axios";
import "./App.css"; // reuse your existing styles for background, container, etc.

export default function Goal({ user, setUser, onGoalSaved }) {
  const [goal, setGoal] = useState(user.goal || "");

  const saveGoal = async () => {
    try {
      const res = await axios.put(`http://localhost:3000/users/${user.id}`, {
        goal,
      });

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));

      // Notify App to switch page to tracker
      onGoalSaved();
    } catch (err) {
      console.error(err);
      alert("Failed to update goal");
    }
  };

  return (
    <div className="app-container">
      {/* Background image from App.css */}
      <img
        src="/background_day.png"
        className="background-image"
        alt="background"
      />

      <div className="content">
        <h1 className="goal-title">Set Your Goal</h1>

        <input
          type="text"
          placeholder="Enter your goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "1.2rem",
            borderRadius: "8px",
            width: "300px",
            marginBottom: "10px",
          }}
        />

        <button
          onClick={saveGoal}
          style={{
            padding: "10px 20px",
            fontSize: "1.2rem",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Save Goal
        </button>
      </div>
    </div>
  );
}
