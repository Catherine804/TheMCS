// Tracker.jsx
import { useState, useEffect } from "react";
import { getSheepImage, getHeartsImage } from "./sheep.jsx";

export default function Tracker({ user, setUser, onAddMoreGoals }) {
  // Helper to normalize goals (handle both old string format and new object format)
  const normalizeGoals = (userGoals) => {
    if (!userGoals || userGoals.length === 0) {
      return [];
    }
    return userGoals.map(goal => {
      if (typeof goal === "string") {
        // Old format: convert to new format with default values
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

  // Get goals from user.goals array or fallback to user.goal (backward compatibility)
  const rawGoals = user.goals || (user.goal ? [user.goal] : []);
  const goals = normalizeGoals(rawGoals);
  
  // Track hearts and checkbox states for each goal
  const [goalStates, setGoalStates] = useState(() => {
    // Initialize state for each goal
    const initial = {};
    goals.forEach((_, index) => {
      initial[index] = {
        hearts: 3,
        checkboxChecked: false,
        previousHearts: 3 // Track hearts before checking to allow reverting
      };
    });
    return initial;
  });

  // Update goal states when goals change (only when goals.length changes)
  useEffect(() => {
    setGoalStates(prev => {
      const newStates = { ...prev };
      // Only initialize new goals, don't reset existing ones
      goals.forEach((_, index) => {
        if (!newStates[index]) {
          newStates[index] = {
            hearts: 3,
            checkboxChecked: false,
            previousHearts: 3
          };
        }
      });
      return newStates;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goals.length]);

    
  const handleCheckbox = (goalIndex, checked) => {
    setGoalStates(prev => {
      const newStates = { ...prev };
      const currentState = newStates[goalIndex] || { hearts: 3, checkboxChecked: false, previousHearts: 3 };
      
      if (checked) {
        // User checked the box - mark as completed
        // Store current hearts as previousHearts before potentially adding a heart
        const heartsBeforeCheck = currentState.hearts;
        
        // Restore 1 heart if hearts < 3 (this includes recovering from 0 hearts)
        // This is the ONLY way to recover from 0 hearts/dead state
        const newHearts = currentState.hearts < 3 ? currentState.hearts + 1 : currentState.hearts;
        
        newStates[goalIndex] = {
          ...currentState,
          checkboxChecked: true,
          hearts: newHearts,
          previousHearts: heartsBeforeCheck // Store the state before checking
        };
      } else {
        // User unchecked the box - revert to previous state (before it was checked)
        newStates[goalIndex] = {
          ...currentState,
          checkboxChecked: false,
          hearts: currentState.previousHearts !== undefined ? currentState.previousHearts : currentState.hearts // Restore previous hearts
        };
      }

      return newStates;
    });
  };

  
  // Heart-loss timer with individual intervals for each goal
  useEffect(() => {
    const intervals = goals.map((goal, goalIndex) => {
      // Use the goal's individual interval (stored in goal.interval)
      const intervalMs = goal.interval || 10000;
      
      return setInterval(() => {
        setGoalStates(prev => {
          // Use functional update to get the latest state
          const currentState = prev[goalIndex];
          if (!currentState) {
            // If state doesn't exist, initialize it
            return {
              ...prev,
              [goalIndex]: {
                hearts: 3,
                checkboxChecked: false,
                previousHearts: 3
              }
            };
          }
          
          let heartsAfterLoss = currentState.hearts;
          
          // Lose a heart if user missed the goal and hearts > 0
          // When hearts reach 0, sheep is dead and cannot lose more hearts
          // The ONLY way to recover from 0 hearts is by checking the checkbox
          if (!currentState.checkboxChecked && currentState.hearts > 0) {
            heartsAfterLoss = currentState.hearts - 1;
            alert(`You missed your goal "${goal.text}"! Heart lost.`);
          }
          // If hearts are already 0, they stay at 0 (dead) until checkbox is checked
          
          // Always reset checkbox for next cycle and update state with new hearts
          return {
            ...prev,
            [goalIndex]: {
              hearts: heartsAfterLoss,
              checkboxChecked: false,
              previousHearts: heartsAfterLoss // Update previousHearts to current state
            }
          };
        });
      }, intervalMs); // Use individual interval for each goal
    });
  
    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goals.length]);
  

  if (goals.length === 0) {
    return (
      <div className="content">
        <h1 className="goal-title">No goals set</h1>
        <p style={{ color: "white", textShadow: "1px 1px 2px black" }}>
          Please set your goals first
        </p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <img
        src="/background_day.png"
        className="background-image"
        alt="background"
      />
      
      <div className="content" style={{ position: "relative" }}>
        <h1 className="goal-title">Track Your Goals</h1>

        {/* Add More Goals box - shows when there are less than 3 goals, positioned in top corner */}
        {goals.length > 0 && goals.length < 3 && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              padding: "15px 20px",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              borderRadius: "12px",
              backdropFilter: "blur(5px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              border: "2px dashed rgba(255, 255, 255, 0.5)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              minWidth: "150px",
            }}
            onClick={onAddMoreGoals}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.8)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.5)";
            }}
          >
            <div style={{ 
              fontSize: "2rem", 
              color: "white", 
              textShadow: "1px 1px 2px black" 
            }}>
              +
            </div>
            <h3 style={{ 
              color: "white", 
              textShadow: "1px 1px 2px black",
              fontSize: "1rem",
              textAlign: "center",
              fontWeight: "bold",
              margin: 0
            }}>
              Add More Goals?
            </h3>
            <p style={{ 
              color: "white", 
              textShadow: "1px 1px 2px black",
              fontSize: "0.8rem",
              textAlign: "center",
              margin: 0
            }}>
              {3 - goals.length} more available
            </p>
          </div>
        )}

        {/* Goal cards - each with its own sheep and hearts, side by side */}
        <div style={{ 
          display: "flex", 
          flexDirection: "row", 
          gap: "20px",
          marginTop: "20px",
          width: "100%",
          maxWidth: "1200px",
          alignItems: "flex-start",
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          {goals.map((goal, index) => {
            const goalHearts = goalStates[index]?.hearts !== undefined ? goalStates[index].hearts : 3;
            return (
              <div
                key={index}
                style={{
                  flex: "1",
                  minWidth: "250px",
                  maxWidth: "350px",
                  padding: "20px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  backdropFilter: "blur(5px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {/* Goal name or number at the top */}
                <h3 style={{ 
                  color: "white", 
                  textShadow: "1px 1px 2px black",
                  marginBottom: "5px",
                  fontSize: "1.1rem",
                  textAlign: "center",
                  fontWeight: "bold",
                  minHeight: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  Goal {index + 1}: {goal.text}
                </h3>

                {/* Deadline display */}
                {goal.deadline && (
                  <div style={{ 
                    color: "white", 
                    textShadow: "1px 1px 2px black",
                    fontSize: "0.9rem",
                    textAlign: "center",
                    marginBottom: "5px",
                    padding: "5px 10px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "6px"
                  }}>
                    Deadline: {new Date(goal.deadline).toLocaleDateString()}
                  </div>
                )}

                {/* Hearts image for this goal */}
                <img
                  src={getHeartsImage(goalHearts)}
                  className="hearts"
                  alt={`health bar for ${goal}`}
                  style={{ width: "120px" }}
                />

                {/* Sheep image for this goal - color based on goal position */}
                <img
                  src={getSheepImage(index, goalHearts)}
                  className="sheep"
                  alt={`sheep for ${goal.text}`}
                  style={{ width: "180px" }}
                />

                {/* Checkbox */}
                <label className="checkbox-container" style={{ display: "block", marginTop: "10px", textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={goalStates[index]?.checkboxChecked || false}
                    onChange={(e) => handleCheckbox(index, e.target.checked)}
                  />
                  I worked on this goal today
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}