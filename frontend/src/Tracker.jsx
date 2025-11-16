// Tracker.jsx
import { useState, useEffect } from "react";
import { getSheepImage, getHeartsImage } from "./sheep.jsx";
import GoalArchive from "./GoalArchive.jsx";

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
        deadline: goal.deadline || null,
        completed: goal.completed || false,
        completedDate: goal.completedDate || null
      };
    });
  };

  // Get goals from user.goals array or fallback to user.goal (backward compatibility)
  const rawGoals = user.goals || (user.goal ? [user.goal] : []);
  const goals = normalizeGoals(rawGoals);
  
  // Track hearts and checkbox states for each goal
  const [goalStates, setGoalStates] = useState(() => {
    // Try to load saved goal states from sessionStorage
    const savedStates = sessionStorage.getItem(`goalStates_${user.id}`);
    
    // Initialize state for each goal
    const initial = {};
    
    if (savedStates) {
      try {
        const parsed = JSON.parse(savedStates);
        // Restore saved states for existing goals
        goals.forEach((goal, index) => {
          if (parsed[index] !== undefined) {
            // Use saved state for this goal
            initial[index] = parsed[index];
          } else {
            // New goal - initialize with default values
            const isCompleted = goal.completed || false;
            initial[index] = {
              hearts: 3,
              checkboxChecked: false,
              previousHearts: 3,
              completed: isCompleted
            };
          }
        });
        return initial;
      } catch (err) {
        console.error("Failed to parse saved goal states:", err);
      }
    }
    
    // First time or if saved data is invalid - initialize all goals
    goals.forEach((_, index) => {
      const isCompleted = goals[index].completed || false;
      initial[index] = {
        hearts: 3,
        checkboxChecked: false,
        previousHearts: 3,
        completed: isCompleted
      };
    });
    return initial;
  });

  // Save goal states to sessionStorage whenever they change
  useEffect(() => {
    if (Object.keys(goalStates).length > 0) {
      sessionStorage.setItem(`goalStates_${user.id}`, JSON.stringify(goalStates));
    }
  }, [goalStates, user.id]);

  // Track which goal is currently showing completion animation
  const [animatingGoal, setAnimatingGoal] = useState(null);
  
  // Track flying sheep animation
  const [flyingSheep, setFlyingSheep] = useState(null); // { goalIndex, startPos, sheepImage }
  
  // Track if goal card should be hidden
  const [hiddenGoals, setHiddenGoals] = useState(new Set());
  
  // Track counter number for animation
  const [displayedCount, setDisplayedCount] = useState(0);

  const [completedGoalsTotal, setCompletedGoalsTotal] = useState(
    Number(sessionStorage.getItem("completedGoalsTotal")) || 0
  );

  // Helper to remove a goal
  const handleRemoveGoal = (goalIndex) => {
    if (!confirm(`Are you sure you want to remove "${goals[goalIndex].text}"? This action cannot be undone.`)) {
      return;
    }

    // Remove goal from goals array
    const updatedGoals = goals.filter((_, idx) => idx !== goalIndex);
    
    // Update user state
    const updatedUser = {
      ...user,
      goals: updatedGoals
    };
    setUser(updatedUser);
    sessionStorage.setItem("user", JSON.stringify(updatedUser));

    // Remove goal state and reindex remaining goals
    setGoalStates(prev => {
      const newStates = {};
      let newIndex = 0;
      Object.keys(prev).forEach(key => {
        const oldIndex = parseInt(key);
        if (oldIndex !== goalIndex) {
          newStates[newIndex] = prev[oldIndex];
          newIndex++;
        }
      });
      return newStates;
    });
  };

  // Helper to check if deadline has passed
  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);
    return deadlineDate < today;
  };

  // Helper to mark goal as completed - triggers star animation then flying sheep
  const handleMarkCompleted = (goalIndex) => {
    // Immediately mark goal as completed in state so timers stop
    setGoalStates(prev => ({
      ...prev,
      [goalIndex]: {
        ...prev[goalIndex],
        completed: true
      }
    }));
    // Trigger star animation
    setAnimatingGoal(goalIndex);
    
    // After star animation completes (2 seconds), start flying sheep animation
    setTimeout(() => {
      setAnimatingGoal(null);
      
      // Get the sheep's current position
      const sheepElement = document.getElementById(`sheep-${goalIndex}`);
      const boxElement = document.getElementById('completed-goals-box');
      
      if (sheepElement && boxElement) {
        const sheepRect = sheepElement.getBoundingClientRect();
        const boxRect = boxElement.getBoundingClientRect();
        
        // Store flying sheep data
        setFlyingSheep({
          goalIndex,
          startX: sheepRect.left + sheepRect.width / 2,
          startY: sheepRect.top + sheepRect.height / 2,
          endX: boxRect.left + boxRect.width / 2,
          endY: boxRect.top + boxRect.height / 2,
          sheepImage: getSheepImage(goalIndex, 3)
        });
        
        // Hide the goal card immediately
        setHiddenGoals(prev => new Set([...prev, goalIndex]));
        
        // After flying animation completes (1.5 seconds), update counter and state
        setTimeout(() => {
          setFlyingSheep(null);
          
          // Increment displayed count with animation
          setDisplayedCount(prev => prev + 1);
          
          // Mark goal as completed in state
          setGoalStates(prev => {
            const newStates = { ...prev };
            newStates[goalIndex] = {
              ...newStates[goalIndex],
              completed: true
            };
            return newStates;
          });

          // Update user goals to mark as completed and save to sessionStorage
          const updatedGoals = goals.map((goal, idx) => {
            if (idx === goalIndex) {
              return { ...goal, completed: true, completedDate: new Date().toISOString() };
            }
            return goal;
          });

          const updatedUser = {
            ...user,
            goals: updatedGoals
          };
          setUser(updatedUser);
          sessionStorage.setItem("user", JSON.stringify(updatedUser));
        }, 1500);
      }
    }, 2000);
  };

  // Calculate number of completed goals
  const completedGoalsCount = goals.filter((goal, idx) => 
    goalStates[idx]?.completed || goal.completed
  ).length;
  
  // Initialize displayed count on mount
  useEffect(() => {
    setDisplayedCount(completedGoalsCount);
  }, []);

  // Update goal states when goals change (only when goals.length changes)
  useEffect(() => {
    setGoalStates(prev => {
      const newStates = { ...prev };
      // Only initialize new goals, don't reset existing ones
      goals.forEach((goal, index) => {
        if (!newStates[index]) {
          // This is a new goal that doesn't have a state yet
          const isCompleted = goal.completed || false;
          newStates[index] = {
            hearts: 3,
            checkboxChecked: false,
            previousHearts: 3,
            completed: isCompleted
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
      const intervalMs = goal.interval || 10000;
  
      return setInterval(() => {
        setGoalStates(prev => {
          const currentState = prev[goalIndex];
          if (!currentState) return prev;
  
          // Skip timer if goal is completed in the goals array
          if (goal.completed) {
            return prev;
          }
  
          let heartsAfterLoss = currentState.hearts;
  
          if (!currentState.checkboxChecked && currentState.hearts > 0) {
            heartsAfterLoss -= 1;
          }
  
          return {
            ...prev,
            [goalIndex]: {
              ...currentState,
              hearts: heartsAfterLoss,
              checkboxChecked: false,
              previousHearts: heartsAfterLoss
            }
          };
        });
      }, intervalMs);
    });
  
    return () => intervals.forEach(interval => clearInterval(interval));
  }, [goals]); // Re-run whenever goals array changes

  

  if (goals.length === 0) {
    // If no goals, redirect to goal setting page
    onAddMoreGoals();
    return null;
  }
  
  // Check if all goals are completed
  const allGoalsCompleted = goals.length > 0 && completedGoalsCount === goals.length;

  const activeGoalsCount = goals.filter((_, idx) => !goalStates[idx]?.completed).length;
  const maxGoals = 3;
  const remainingGoals = maxGoals - activeGoalsCount;

  return (
    <div className="app-container">
      <img
        src="/background_day.png"
        className="background-image"
        alt="background"
      />
      
      {/* Flying sheep animation overlay */}
      {flyingSheep && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 9999
          }}
        >
          <img
            src={flyingSheep.sheepImage}
            alt="flying sheep"
            style={{
              position: 'absolute',
              width: '180px',
              animation: 'flyToBox 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
              '--start-x': `${flyingSheep.startX}px`,
              '--start-y': `${flyingSheep.startY}px`,
              '--end-x': `${flyingSheep.endX}px`,
              '--end-y': `${flyingSheep.endY}px`,
            }}
          />
        </div>
      )}
      
      <div className="content" style={{ position: "relative" }}>
        {!allGoalsCompleted ? (
          <>
            <h1 className="goal-title">Track Your Goals</h1>

            {/* Completed Goals Box - ALWAYS visible when user has 1-3 goals */}
            {goals.length > 0 && goals.length <= 3 && (
              <div
                id="completed-goals-box"
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
                  animation: displayedCount > 0 ? "bounce 2s ease-in-out infinite" : "none",
                  transition: "all 0.3s ease",
                  minWidth: "60px",
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
                  {displayedCount}
                </span>
              </div>
            )}

            {/* Add More Goals box - shows when there are less than 3 goals, positioned in top corner */}
            {goals.length > 0 && goals.length < 3 && (
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={onAddMoreGoals}
              >
                <svg width="200" height="100" viewBox="0 0 200 100" style={{ filter: "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.2))" }}>
                  {/* Cloud shape using path - wider and shorter */}
                  <path
                    d="M 30,50 Q 30,35 45,35 Q 45,20 65,20 Q 85,20 95,28 Q 115,18 135,30 Q 160,30 170,45 Q 175,45 175,52 Q 175,65 160,65 L 45,65 Q 30,65 30,50 Z"
                    fill="rgba(255, 255, 255, 0.8)"
                    stroke="none"
                    style={{ transition: "all 0.3s ease" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.fill = "rgba(255, 255, 255, 0.95)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.fill = "rgba(255, 255, 255, 0.8)";
                    }}
                  />
                </svg>
                
                {/* Content overlay */}
                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  pointerEvents: "none",
                  width: "80%"
                }}>
                  <div style={{ 
                    fontSize: "1.8rem", 
                    color: "#5A9FD4", 
                    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                    lineHeight: "1"
                  }}>
                    +
                  </div>
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0px"
                  }}>
                    <span style={{ 
                      color: "#5A9FD4", 
                      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      lineHeight: "1.1"
                    }}>
                      Add More
                    </span>
                    <span style={{ 
                      color: "#7AB8E8", 
                      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                      fontSize: "0.7rem",
                      lineHeight: "1.1"
                    }}>
                      ({remainingGoals} available)
                    </span>
                  </div>
                </div>
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
                // Skip rendering if this goal is hidden (flying away)
                if (hiddenGoals.has(index)) {
                  return null;
                }
                
                const goalState = goalStates[index];
                const goalHearts = goalState?.hearts !== undefined ? goalState.hearts : 3;
                const deadlinePassed = isDeadlinePassed(goal.deadline);
                
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
                      position: "relative"
                    }}
                  >
                    {/* Remove button in top-right corner */}
                    <button
                      onClick={() => handleRemoveGoal(index)}
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        padding: "5px 10px",
                        fontSize: "0.85rem",
                        borderRadius: "6px",
                        cursor: "pointer",
                        backgroundColor: "#ff4444",
                        color: "white",
                        border: "none",
                        fontWeight: "bold",
                        transition: "all 0.2s ease",
                        zIndex: 10
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#cc0000";
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#ff4444";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      Remove
                    </button>

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
                        color: deadlinePassed ? "#ff6b6b" : "white", 
                        textShadow: "1px 1px 2px black",
                        fontSize: "0.9rem",
                        textAlign: "center",
                        marginBottom: "5px",
                        padding: "5px 10px",
                        backgroundColor: deadlinePassed ? "rgba(255, 107, 107, 0.3)" : "rgba(255, 255, 255, 0.1)",
                        borderRadius: "6px",
                        fontWeight: deadlinePassed ? "bold" : "normal"
                      }}>
                        {deadlinePassed ? "⚠️ Deadline Passed: " : "Deadline: "}
                        {new Date(goal.deadline).toLocaleDateString()}
                      </div>
                    )}

                    {/* Hearts image for this goal */}
                    <img
                      src={getHeartsImage(goalHearts)}
                      className="hearts"
                      alt={`health bar for ${goal}`}
                      style={{ width: "120px" }}
                    />

                    {/* Sheep container with animation */}
                    <div style={{ position: "relative", display: "inline-block" }}>
                      {/* Star animation - appears behind sheep when goal is completed */}
                      {animatingGoal === index && (
                        <div style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          width: "200px",
                          height: "200px",
                          pointerEvents: "none",
                          zIndex: 0,
                          transform: "translate(-50%, -50%)"
                        }}>
                          {[...Array(8)].map((_, i) => {
                            const rotation = i * 45;
                            return (
                              <div
                                key={i}
                                className="star-animation"
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transformOrigin: "50% 50%",
                                  animation: `starPop 1s ease-out ${i * 0.1}s forwards`,
                                  opacity: 0
                                }}
                              >
                                <span style={{
                                  fontSize: "28px",
                                  color: "#FFD700",
                                  textShadow: "0 0 15px rgba(255, 215, 0, 1), 0 0 30px rgba(255, 215, 0, 0.6)",
                                  filter: "drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))",
                                  display: "inline-block",
                                  transform: `rotate(${rotation}deg) translateY(-70px)`
                                }}>⭐</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      {/* Sheep image - show happy sheep (3 hearts) during animation */}
                      <img
                        id={`sheep-${index}`}
                        src={getSheepImage(index, animatingGoal === index ? 3 : goalHearts)}
                        className="sheep"
                        alt={`sheep for ${goal.text}`}
                        style={{ 
                          width: "180px",
                          position: "relative",
                          zIndex: 1,
                          transition: animatingGoal === index ? "none" : "all 0.3s ease"
                        }}
                      />
                    </div>

                    {/* Checkbox */}
                    <label className="checkbox-container" style={{ display: "block", marginTop: "10px", textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={goalState?.checkboxChecked || false}
                        onChange={(e) => handleCheckbox(index, e.target.checked)}
                      />
                      I worked on this goal today
                    </label>

                    {/* Mark as Completed button - disabled if sheep is dead */}
                    <button
                      onClick={() => handleMarkCompleted(index)}
                      disabled={goalHearts === 0}
                      style={{
                        marginTop: "10px",
                        padding: "8px 16px",
                        fontSize: "0.9rem",
                        borderRadius: "8px",
                        cursor: goalHearts === 0 ? "not-allowed" : "pointer",
                        backgroundColor: goalHearts === 0 ? "#cccccc" : "#4CAF50",
                        color: goalHearts === 0 ? "#666666" : "white",
                        border: "none",
                        fontWeight: "bold",
                        opacity: goalHearts === 0 ? 0.5 : 1
                      }}
                    >
                      {goalHearts === 0 ? "❌ Cannot Complete (Sheep Dead)" : "✓ Mark as Completed"}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Congratulations screen when all goals are completed */
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "30px",
            animation: "fadeIn 1s ease"
          }}>
            <h1 style={{
              color: "white",
              fontSize: "3rem",
              textShadow: "3px 3px 6px black",
              marginBottom: "10px",
              animation: "float 3s ease-in-out infinite"
            }}>
              🎉 Congratulations! 🎉
            </h1>
            
            <p style={{
              color: "white",
              fontSize: "1.5rem",
              textShadow: "2px 2px 4px black",
              textAlign: "center",
              maxWidth: "600px"
            }}>
              You've completed all your goals!<br/>
              Your sheep are safe in the box. 📦
            </p>
            
            <div style={{
              padding: "30px 40px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "20px",
              backdropFilter: "blur(10px)",
              border: "3px solid rgba(255, 255, 255, 0.5)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "15px"
            }}
            onClick={onAddMoreGoals}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.transform = "scale(1)";
            }}
            >
              <div style={{ 
                fontSize: "3rem", 
                color: "white", 
                textShadow: "2px 2px 4px black" 
              }}>
                +
              </div>
              <h2 style={{ 
                color: "white", 
                textShadow: "2px 2px 4px black",
                fontSize: "1.8rem",
                textAlign: "center",
                fontWeight: "bold",
                margin: 0
              }}>
                Set New Goals
              </h2>
              <p style={{ 
                color: "white", 
                textShadow: "1px 1px 2px black",
                fontSize: "1.1rem",
                textAlign: "center",
                margin: 0
              }}>
                Ready for more? Create up to 3 goals!
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Add CSS for flying animation */}
      <style>{`
        @keyframes flyToBox {
          0% {
            left: var(--start-x);
            top: var(--start-y);
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            left: var(--end-x);
            top: var(--end-y);
            transform: translate(-50%, -50%) scale(0.2);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}