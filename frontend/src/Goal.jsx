import { useState, useEffect } from "react";
import axios from "axios";
import GoalArchive from "./GoalArchive.jsx";
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

  // Track the goals that have been added
  const initialGoals = () => {
    const userGoals = user.goals 
      ? normalizeGoals(user.goals)
      : (user.goal ? normalizeGoals([user.goal]) : []);
    return userGoals;
  };
  
  const [savedGoals, setSavedGoals] = useState(initialGoals);
  
  // Current goal being edited (single input)
  const [currentGoal, setCurrentGoal] = useState({ 
    text: "", 
    frequency: "daily", 
    interval: 10000, 
    deadline: null 
  });
  
  // Show success message
  const [showSuccess, setShowSuccess] = useState(false);

  // Archive state
  const [showArchive, setShowArchive] = useState(false);
  const [archivedGoals, setArchivedGoals] = useState(() => {
    const saved = sessionStorage.getItem("archivedGoals");
    return saved ? JSON.parse(saved) : [];
  });

  // Update saved goals when user changes
  useEffect(() => {
    const userGoals = user.goals 
      ? normalizeGoals(user.goals)
      : (user.goal ? normalizeGoals([user.goal]) : []);
    setSavedGoals(userGoals);
  }, [user]);

  // Frequency options with their intervals (in milliseconds for testing)
  const frequencyOptions = [
    { label: "Once a day", value: "daily", interval: 10000 }, // 10 seconds for testing
    { label: "Once a week", value: "weekly", interval: 20000 }, // 20 seconds for testing
    { label: "Twice a week", value: "biweekly", interval: 30000 }, // 30 seconds for testing
  ];

  const updateCurrentGoal = (field, value) => {
    if (field === "text") {
      setCurrentGoal({ ...currentGoal, text: value });
    } else if (field === "frequency") {
      const selectedOption = frequencyOptions.find(opt => opt.value === value);
      setCurrentGoal({
        ...currentGoal,
        frequency: value,
        interval: selectedOption ? selectedOption.interval : 10000
      });
    } else if (field === "deadline") {
      setCurrentGoal({
        ...currentGoal,
        deadline: value === "" || value === "no-deadline" ? null : value
      });
    }
  };

  const addGoal = async () => {
    // Validate that goal text is not empty
    if (!currentGoal.text || currentGoal.text.trim() === "") {
      alert("Please enter a goal");
      return;
    }
    
    // Check if already at max goals
    if (savedGoals.length >= 3) {
      alert("You can only have 3 goals maximum");
      return;
    }

    try {
      // Save goal to backend
      const payload = {
        userId: user.id,
        title: currentGoal.text,
        description: "",
        frequency: currentGoal.frequency,
        deadline: currentGoal.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      console.log("Sending payload:", payload);
      const response = await axios.post("http://localhost:5000/goals", payload);
      console.log("Response:", response.data);

      // Add to saved goals
      const newSavedGoals = [...savedGoals, currentGoal];
      setSavedGoals(newSavedGoals);

      // Update user state
      const updatedUser = {
        ...user,
        goals: newSavedGoals
      };
      setUser(updatedUser);
      sessionStorage.setItem("user", JSON.stringify(updatedUser));

      // Clear current goal and show success message
      setCurrentGoal({ text: "", frequency: "daily", interval: 10000, deadline: null });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

    } catch (err) {
      console.error("Full error:", err);
      console.error("Error response:", err.response);
      if (err.response && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert("Failed to save goal. Make sure the backend is running.");
      }
    }
  };

  const removeGoal = (index) => {
    const newSavedGoals = savedGoals.filter((_, i) => i !== index);
    setSavedGoals(newSavedGoals);
    
    const updatedUser = {
      ...user,
      goals: newSavedGoals
    };
    setUser(updatedUser);
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const goToTracker = () => {
    if (savedGoals.length === 0) {
      alert("Please add at least one goal before going to tracker");
      return;
    }
    onGoalSaved();
  };

  return (
    <div className="app-container">
      <img
        src="/background_day.png"
        className="background-image"
        alt="background"
      />

      {/* Goal Archive Modal */}
      <GoalArchive 
        isOpen={showArchive}
        onClose={() => setShowArchive(false)}
        completedGoals={archivedGoals}
      />

      {/* Archive Box - Always visible in bottom-left */}
      <div
        onClick={() => setShowArchive(true)}
        style={{
          position: "fixed",
          bottom: "15px",
          left: "15px",
          padding: "10px 15px",
          backgroundColor: "transparent",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          cursor: "pointer",
          animation: archivedGoals.length > 0 ? "bounce 2s ease-in-out infinite" : "none",
          transition: "all 0.3s ease",
          minWidth: "60px",
          zIndex: 100,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <span style={{ 
          fontSize: "2rem", 
          filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))"
        }}>
          📦
        </span>
        <span style={{ 
          color: "white", 
          textShadow: "2px 2px 4px black",
          fontSize: "1.8rem",
          fontWeight: "bold"
        }}>
          {archivedGoals.length}
        </span>
      </div>

      <div className="content" style={{ 
        overflowY: "auto", 
        maxHeight: "100vh", 
        paddingBottom: "40px" 
      }}>
        {/* Back to Tracker button - only show if user already has goals */}
        {user.goals && user.goals.length > 0 && (
          <button
            onClick={onGoalSaved}
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              padding: "10px 20px",
              fontSize: "1rem",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              border: "2px solid white",
              fontWeight: "bold",
              backdropFilter: "blur(5px)",
              transition: "all 0.3s ease",
              zIndex: 101
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            ← Back to Tracker
          </button>
        )}
        
        <h1 className="goal-title">Set Your Goals</h1>
        <p style={{ color: "white", textShadow: "1px 1px 2px black", marginBottom: "20px" }}>
          You can set up to 3 goals ({savedGoals.length}/3 added)
        </p>

        {/* Success message */}
        {showSuccess && (
          <div style={{
            padding: "15px 30px",
            backgroundColor: "rgba(76, 175, 80, 0.9)",
            color: "white",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            textAlign: "center",
            animation: "fadeInOut 2s ease-in-out"
          }}>
            ✓ Goal added!
          </div>
        )}

        {/* List of already added goals */}
        {savedGoals.length > 0 && (
          <div style={{
            marginBottom: "30px",
            width: "100%",
            maxWidth: "500px"
          }}>
            <h2 style={{ 
              color: "white", 
              textShadow: "1px 1px 2px black",
              fontSize: "1.3rem",
              marginBottom: "15px"
            }}>
              Your Goals:
            </h2>
            {savedGoals.map((goal, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  marginBottom: "10px",
                  padding: "15px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  backdropFilter: "blur(5px)"
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    color: "white", 
                    textShadow: "1px 1px 2px black",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    marginBottom: "5px"
                  }}>
                    {index + 1}. {goal.text}
                  </div>
                  <div style={{ 
                    color: "rgba(255, 255, 255, 0.8)", 
                    textShadow: "1px 1px 2px black",
                    fontSize: "0.9rem"
                  }}>
                    {frequencyOptions.find(opt => opt.value === goal.frequency)?.label || goal.frequency}
                    {goal.deadline && ` • Deadline: ${new Date(goal.deadline).toLocaleDateString()}`}
                  </div>
                </div>
                <button
                  onClick={() => removeGoal(index)}
                  style={{
                    padding: "8px 12px",
                    fontSize: "0.9rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: "#ff4444",
                    color: "white",
                    border: "none",
                    fontWeight: "bold"
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add new goal section - only show if less than 3 goals */}
        {savedGoals.length < 3 && (
          <>
            <h2 style={{ 
              color: "white", 
              textShadow: "1px 1px 2px black",
              fontSize: "1.3rem",
              marginBottom: "15px"
            }}>
              {savedGoals.length === 0 ? "Add Your First Goal:" : "Add Another Goal:"}
            </h2>
            
            <div
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
                  placeholder="Enter your goal"
                  value={currentGoal.text}
                  onChange={(e) => updateCurrentGoal("text", e.target.value)}
                  style={{
                    padding: "10px",
                    fontSize: "1.2rem",
                    borderRadius: "8px",
                    flex: 1,
                  }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <label style={{ color: "white", textShadow: "1px 1px 2px black", fontSize: "1rem" }}>
                  Frequency:
                </label>
                <select
                  value={currentGoal.frequency}
                  onChange={(e) => updateCurrentGoal("frequency", e.target.value)}
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
                    value={currentGoal.deadline || ""}
                    onChange={(e) => updateCurrentGoal("deadline", e.target.value)}
                    placeholder="Select deadline (optional)"
                    style={{
                      padding: "8px",
                      fontSize: "1rem",
                      borderRadius: "8px",
                      flex: 1,
                      maxWidth: "200px",
                    }}
                  />
                  {currentGoal.deadline ? (
                    <button
                      type="button"
                      onClick={() => updateCurrentGoal("deadline", "no-deadline")}
                      style={{
                        padding: "8px 12px",
                        fontSize: "0.9rem",
                        borderRadius: "8px",
                        cursor: "pointer",
                        backgroundColor: "#ff4444",
                        color: "white",
                        border: "none",
                      }}
                    >
                      Remove Deadline
                    </button>
                  ) : (
                    <div style={{ 
                      fontSize: "0.85rem", 
                      color: "rgba(255, 255, 255, 0.7)", 
                      textShadow: "1px 1px 2px black" 
                    }}>
                      (Optional)
                    </div>
                  )}
                </div>
              </div>
              {currentGoal.deadline && (
                <div style={{ 
                  fontSize: "0.85rem", 
                  color: "rgba(255, 255, 255, 0.8)", 
                  textShadow: "1px 1px 2px black",
                  marginLeft: "10px"
                }}>
                  Deadline set: {new Date(currentGoal.deadline).toLocaleDateString()}
                </div>
              )}
            </div>

            <button
              onClick={addGoal}
              style={{
                padding: "10px 20px",
                fontSize: "1.2rem",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                marginTop: "10px",
                fontWeight: "bold"
              }}
            >
              Add Goal
            </button>
          </>
        )}

        {/* Go to Tracker button - show when at least one goal is added */}
        {savedGoals.length > 0 && (
          <button
            onClick={goToTracker}
            style={{
              padding: "12px 30px",
              fontSize: "1.3rem",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              marginTop: "20px",
              fontWeight: "bold"
            }}
          >
            {savedGoals.length >= 3 ? "Start Tracking (3/3 Goals)" : `Start Tracking (${savedGoals.length}/3 Goals)`}
          </button>
        )}
      </div>
      
      {/* Add CSS for fade animation */}
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}