
import { useState } from "react";
import "./App.css";

function App() {
  // State for hearts (3 = full health)
  const [hearts, setHearts] = useState(3);

  return (
    <div className="app-container">
    
      <img
        src="/background_day.png"
        className="background-image"
        alt="background"
      />

      <div className="content">
        
        <h1 className="goal-title">Goal: Study 1 hour a day</h1>

        
        <img
          src="/hearts_3hearts-removebg-preview.png"
          className="hearts"
          alt="health bar"
        />
        
        <img src="/sheep1_happy-removebg-preview.png" className="sheep" alt="sheep" />

       
        <label className="checkbox-container">
          <input type="checkbox" />
          I worked on my goal today
        </label>
      </div>
    </div>
  );
}

export default App;
