import { useState, useEffect } from "react";
import Goal from "./Goal.jsx";
import Tracker from "./Tracker.jsx";
import "./App.css";

export default function App({ user: initialUser }) {
  const [user, setUser] = useState(initialUser);
  const [currentPage, setCurrentPage] = useState("goal"); // "goal" or "tracker"

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        // If user has goals, go to tracker; otherwise, go to goal setup
        if (parsedUser.goals && parsedUser.goals.length > 0) {
          setCurrentPage("tracker");
        }
      } catch (err) {
        console.error("Failed to parse saved user:", err);
      }
    }
  }, []);

  // Sync user state with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const handleGoalSaved = () => {
    setCurrentPage("tracker");
  };

  const handleAddMoreGoals = () => {
    setCurrentPage("goal");
  };

  if (currentPage === "goal") {
    return <Goal user={user} setUser={setUser} onGoalSaved={handleGoalSaved} />;
  }

  return <Tracker user={user} setUser={setUser} onAddMoreGoals={handleAddMoreGoals} />;
}
