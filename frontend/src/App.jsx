import { useState } from "react";
import "./App.css"; // optional for styling

function App() {
  // Dummy data: 1 goal = 1 sheep
  const [goals, setGoals] = useState([
    { id: 1, name: "Brush teeth", status: "healthy" },
    { id: 2, name: "Exercise", status: "sad" },
  ]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🐑 My Sheep App</h1>
      {goals.map((goal) => (
        <div key={goal.id} style={{ marginBottom: "20px" }}>
          <h2>{goal.name}</h2>
          <p>Sheep status: {goal.status}</p>
        </div>
      ))}
    </div>
  );
}

export default App;

