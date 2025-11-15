// Goal.jsx
import { useState } from "react";
import "./App.css";
import axios from "axios";

export default function Goal({ user, setUser }) {
  const [goal, setGoal] = useState(user.goal || "");

  const saveGoal = async () => {
    try {
      const res = await axios.put(`http://localhost:3000/users/${user.id}`, {
        goal,
      });

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      alert("Goal updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update goal");
    }
  };

  return (
    <div className="goal-container">
      <h2>Your Goal</h2>
      <input
        type="text"
        placeholder="Enter your goal"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />
      <button onClick={saveGoal}>Save Goal</button>
    </div>
  );
}
