// Tracker.jsx
import { useState, useEffect } from "react";

export default function Tracker({ user, setUser, onAddMoreGoals }) {
  // Helper to normalize goals (handle both old string format and new object format)
  const normalizeGoals = (userGoals) => {
    if (!userGoals || userGoals.length === 0) {
      return [];
    }
    return userGoals.map(goal => {
      if (typeof goal === "string") {
        // Old format: convert to new format with default values
        return { text: goal, frequency: "daily", interval: 10000 };
      }
      // New format: ensure all fields exist
      return {
        text: goal.text || "",
        frequency: goal.frequency || "daily",
        interval: goal.interval || 10000
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

  // Update goal states when goals change
  useEffect(() => {
    const newStates = {};
    goals.forEach((_, index) => {
      if (goalStates[index]) {
        newStates[index] = goalStates[index];
      } else {
        newStates[index] = {
          hearts: 3,
          checkboxChecked: false,
          previousHearts: 3
        };
      }
    });
    setGoalStates(newStates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goals.length]);

  const getHeartsImage = (hearts) => {
    switch (hearts) {
      case 3: return "/hearts_3hearts-removebg-preview.png";
      case 2: return "/hearts_2hearts-removebg-preview.png";
      case 1: return "/hearts_1heart-removebg-preview.png";
      case 0: return "/hearts_0hearts-removebg-preview.png";
      default: return "/hearts_3hearts-removebg-preview.png";
    }
  };

  const getSheepImage = (hearts) => {
    switch (hearts) {
      case 3: return "/sheep1_happy-removebg-preview.png";
      case 2: return "/sheep2_annoyed-removebg-preview.png";
      case 1: return "/sheep3_sick-removebg-preview.png";
      case 0: return "/sheep4_dead-removebg-preview.png";
      default: return "/sheep1_happy-removebg-preview.png";
    }
  };
    
  const handleCheckbox = (goalIndex, checked) => {
    setGoalStates(prev => {
      const newStates = { ...prev };
      const currentState = newStates[goalIndex] || { hearts: 3, checkboxChecked: false, previousHearts: 3 };
      
      if (checked) {
        // User checked the box - mark as completed
        // Store current hearts as previousHearts before potentially adding a heart
        const heartsBeforeCheck = currentState.hearts;
        
        newStates[goalIndex] = {
          ...currentState,
          checkboxChecked: true,
          previousHearts: heartsBeforeCheck // Store the state before checking
        };

        // Restore 1 heart if hearts < 3
        if (currentState.hearts < 3) {
          newStates[goalIndex].hearts = currentState.hearts + 1;
        }
      } else {
        // User unchecked the box - revert to previous state (before it was checked)
        newStates[goalIndex] = {
          ...currentState,
          checkboxChecked: false,
          hearts: currentState.previousHearts || currentState.hearts // Restore previous hearts
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
          const newStates = { ...prev };
          const currentState = newStates[goalIndex] || { hearts: 3, checkboxChecked: false, previousHearts: 3 };
          
          if (!currentState.checkboxChecked && currentState.hearts > 0) {
            // Lose a heart if user missed the goal
            const newHearts = currentState.hearts - 1;
            newStates[goalIndex] = {
              ...currentState,
              hearts: newHearts,
              previousHearts: newHearts // Update previousHearts to current hearts
            };
            alert(`You missed your goal "${goal.text}"! Heart lost.`);
          }
          
          // Always reset checkbox for next cycle
          // Also update previousHearts to current hearts so unchecking works correctly
          const finalHearts = newStates[goalIndex]?.hearts || currentState.hearts;
          newStates[goalIndex] = {
            ...(newStates[goalIndex] || { hearts: 3, checkboxChecked: false, previousHearts: 3 }),
            checkboxChecked: false,
            previousHearts: finalHearts // Update previousHearts to current state
          };
          
          return newStates;
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
            const goalHearts = goalStates[index]?.hearts || 3;
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

                {/* Hearts image for this goal */}
                <img
                  src={getHeartsImage(goalHearts)}
                  className="hearts"
                  alt={`health bar for ${goal}`}
                  style={{ width: "120px" }}
                />

                {/* Sheep image for this goal */}
                <img
                  src={getSheepImage(goalHearts)}
                  className="sheep"
                  alt={`sheep for ${goal}`}
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