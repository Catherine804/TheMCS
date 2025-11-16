// GoalArchive.jsx
import { getSheepImage } from "./sheep.jsx";

export default function GoalArchive({ isOpen, onClose, completedGoals }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(3px)",
          zIndex: 10000,
          animation: "fadeIn 0.3s ease"
        }}
      />

      {/* Archive modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "80vh",
          backgroundColor: "#8B6F47", // Brown cardboard color
          borderRadius: "16px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
          zIndex: 10001,
          display: "flex",
          flexDirection: "column",
          animation: "popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px",
            borderBottom: "2px solid #6B563A",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#7A5C3D",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "2rem" }}>📦</span>
            <h2
              style={{
                color: "white",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                margin: 0,
                fontSize: "1.5rem",
                fontWeight: "bold"
              }}
            >
              Goal Archive
            </h2>
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              backgroundColor: "transparent",
              border: "2px solid white",
              color: "white",
              fontSize: "1.5rem",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.transform = "rotate(90deg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.transform = "rotate(0deg)";
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable content area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "15px"
          }}
        >
          {completedGoals.length === 0 ? (
            // Empty state
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
                padding: "40px",
                height: "100%",
                minHeight: "300px"
              }}
            >
              <span style={{ fontSize: "4rem", opacity: 0.5 }}>📦</span>
              <p
                style={{
                  color: "white",
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                  fontSize: "1.2rem",
                  textAlign: "center",
                  margin: 0
                }}
              >
                No completed goals yet
              </p>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                  fontSize: "1rem",
                  textAlign: "center",
                  margin: 0
                }}
              >
                Complete your goals to see them archived here!
              </p>
            </div>
          ) : (
            // List of completed goals
            completedGoals.map((goal, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#A0826D",
                  borderRadius: "12px",
                  padding: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                  transition: "transform 0.2s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                {/* Sheep image */}
                <img
                  src={getSheepImage(goal.originalIndex, 3)}
                  alt={`sheep for ${goal.text}`}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "contain"
                  }}
                />

                {/* Goal details */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "5px"
                    }}
                  >
                    <span style={{ fontSize: "1.2rem" }}>✓</span>
                    <h3
                      style={{
                        color: "white",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                        margin: 0,
                        fontSize: "1.1rem",
                        fontWeight: "bold"
                      }}
                    >
                      {goal.text}
                    </h3>
                  </div>

                  {/* Completion date */}
                  {goal.completedDate && (
                    <p
                      style={{
                        color: "rgba(255, 255, 255, 0.9)",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                        fontSize: "0.9rem",
                        margin: 0
                      }}
                    >
                      Completed: {new Date(goal.completedDate).toLocaleDateString()}
                    </p>
                  )}

                  {/* Deadline if exists */}
                  {goal.deadline && (
                    <p
                      style={{
                        color: "rgba(255, 255, 255, 0.8)",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                        fontSize: "0.85rem",
                        margin: "3px 0 0 0"
                      }}
                    >
                      Original deadline: {new Date(goal.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Celebration emoji */}
                <span style={{ fontSize: "2rem" }}>🎉</span>
              </div>
            ))
          )}
        </div>

        {/* Footer with count */}
        {completedGoals.length > 0 && (
          <div
            style={{
              padding: "15px 20px",
              borderTop: "2px solid #6B563A",
              backgroundColor: "#7A5C3D",
              borderBottomLeftRadius: "16px",
              borderBottomRightRadius: "16px",
              textAlign: "center"
            }}
          >
            <p
              style={{
                color: "white",
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                fontSize: "1rem",
                margin: 0,
                fontWeight: "bold"
              }}
            >
              Total Completed: {completedGoals.length}
            </p>
          </div>
        )}
      </div>

      {/* Add CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes popIn {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }

        /* Custom scrollbar for the archive */
        div::-webkit-scrollbar {
          width: 8px;
        }

        div::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }

        div::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </>
  );
}