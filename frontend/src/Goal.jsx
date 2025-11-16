import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

export default function Goal({ user, setUser, onGoalSaved }) {
  // Helper to normalize goals (handle both old string format and new object format)
  const normalizeGoals = (userGoals) => {
    if (!userGoals || userGoals.length === 0) {
      return [{ text: "", frequency: "daily", interval: 10000, deadline: null }];
    }
    return userGoals.map(goal => {
      if (typeof goal === "string") {
        // Old format: convert to new format
        return { text: goal, frequency: "daily", interval: 10000, deadline: null };
      }
      // New format: ensure all fields exist
      return {
        text: goal.text || "",
        frequency: goal.frequency || "daily",
        interval: goal.interval || 10000,
        deadline: goal.deadline || null
      };
    });
  };

  // Initialize goals from user.goals array or user.goal (for backward compatibility)
  const initialGoals = user.goals 
    ? normalizeGoals(user.goals)
    : (user.goal ? normalizeGoals([user.goal]) : [{ text: "", frequency: "daily", interval: 10000, deadline: null }]);
  const [goals, setGoals] = useState(initialGoals);

  // Update goals when user changes
  useEffect(() => {
    const userGoals = user.goals 
      ? normalizeGoals(user.goals)
      : (user.goal ? normalizeGoals([user.goal]) : [{ text: "", frequency: "daily", interval: 10000, deadline: null }]);
    setGoals(userGoals);
  }, [user]);

  // Frequency options with their intervals (in milliseconds for testing)
  const frequencyOptions = [
    { label: "Once a day", value: "daily", interval: 10000 }, // 10 seconds for testing
    { label: "Once a week", value: "weekly", interval: 20000 }, // 20 seconds for testing
    { label: "Twice a week", value: "biweekly", interval: 30000 }, // 30 seconds for testing
  ];

  const updateGoal = (index, field, value) => {
    const newGoals = [...goals];
    if (field === "text") {
      newGoals[index] = { ...newGoals[index], text: value };
    } else if (field === "frequency") {
      const selectedOption = frequencyOptions.find(opt => opt.value === value);
      newGoals[index] = {
        ...newGoals[index],
        frequency: value,
        interval: selectedOption ? selectedOption.interval : 10000
      };
    } else if (field === "deadline") {
      newGoals[index] = {
        ...newGoals[index],
        deadline: value === "" || value === "no-deadline" ? null : value
      };
    }
    setGoals(newGoals);
  };

  const addGoal = () => {
    if (goals.length < 3) {
      setGoals([...goals, { text: "", frequency: "daily", interval: 10000, deadline: null }]);
    }
  };

  const removeGoal = (index) => {
    if (goals.length > 1) {
      const newGoals = goals.filter((_, i) => i !== index);
      setGoals(newGoals);
    }
  };

  const saveGoals = async () => {
    // Filter out empty goals
    const validGoals = goals.filter(goal => goal.text && goal.text.trim() !== "");
    
    if (validGoals.length === 0) {
      alert("Please enter at least one goal");
      return;
    }

    try {
      // For now, save to localStorage (frontend-only)
      // Later, your friend can connect this to the backend
      const updatedUser = {
        ...user,
        goals: validGoals,
        // Keep backward compatibility with goal property
        goal: validGoals[0].text
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // If backend is available, try to save there too
      if (user.id) {
        try {
          await axios.put(`http://localhost:3000/users/${user.id}`, {
            goals: validGoals,
            goal: validGoals[0].text // backward compatibility
          });
        } catch (err) {
          // Backend not available yet - that's okay for frontend-only work
          console.log("Backend not available, saved locally only");
        }
      }

      // Notify App to switch page to tracker
      onGoalSaved();
    } catch (err) {
      console.error(err);
      alert("Failed to save goals");
    }
  };

  return (
    <div className="app-container">
      <img
        src="/background_day.png"
        className="background-image"
        alt="background"
      />

      <div className="content">
        <h1 className="goal-title">Set Your Goals</h1>
        <p style={{ color: "white", textShadow: "1px 1px 2px black", marginBottom: "20px" }}>
          You can set up to 3 goals
        </p>

        {goals.map((goal, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginBottom: "15px",
              width: "100%",
              maxWidth: "500px",
              padding: "15px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="text"
                placeholder={`Goal ${index + 1}`}
                value={goal.text}
                onChange={(e) => updateGoal(index, "text", e.target.value)}
                style={{
                  padding: "10px",
                  fontSize: "1.2rem",
                  borderRadius: "8px",
                  flex: 1,
                }}
              />
              {goals.length > 1 && (
                <button
                  onClick={() => removeGoal(index)}
                  style={{
                    padding: "10px 15px",
                    fontSize: "1rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: "#ff4444",
                    color: "white",
                    border: "none",
                  }}
                >
                  Remove
                </button>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label style={{ color: "white", textShadow: "1px 1px 2px black", fontSize: "1rem" }}>
                Frequency:
              </label>
              <select
                value={goal.frequency}
                onChange={(e) => updateGoal(index, "frequency", e.target.value)}
                style={{
                  padding: "8px",
                  fontSize: "1rem",
                  borderRadius: "8px",
                  flex: 1,
                  maxWidth: "200px",
                }}
              >
                {frequencyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label style={{ color: "white", textShadow: "1px 1px 2px black", fontSize: "1rem" }}>
                Deadline:
              </label>
              <div style={{ display: "flex", gap: "10px", flex: 1, alignItems: "center" }}>
                <input
                  type="date"
                  value={goal.deadline || ""}
                  onChange={(e) => updateGoal(index, "deadline", e.target.value)}
                  style={{
                    padding: "8px",
                    fontSize: "1rem",
                    borderRadius: "8px",
                    flex: 1,
                    maxWidth: "200px",
                  }}
                />
                <button
                  type="button"
                  onClick={() => updateGoal(index, "deadline", "no-deadline")}
                  style={{
                    padding: "8px 12px",
                    fontSize: "0.9rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: goal.deadline ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.5)",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                  }}
                >
                  No Deadline
                </button>
              </div>
            </div>
          </div>
        ))}

        {goals.length < 3 && (
          <button
            onClick={addGoal}
            style={{
              padding: "8px 16px",
              fontSize: "1rem",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              marginBottom: "10px",
            }}
          >
            + Add Goal ({goals.length}/3)
          </button>
        )}

        <button
          onClick={saveGoals}
          style={{
            padding: "10px 20px",
            fontSize: "1.2rem",
            borderRadius: "8px",
            cursor: "pointer",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            marginTop: "10px",
          }}
        >
          Save Goals
        </button>
      </div>
    </div>
  );
}
