// Tracker.jsx
import { useState, useEffect } from "react";

export default function Tracker({ user, setUser }) {
  const [hearts, setHearts] = useState(3);
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const getHeartsImage = (hearts) => {
    switch (hearts) {
      case 3: return "/hearts_3hearts-removebg-preview.png";
      case 2: return "/hearts_2hearts-removebg-preview.png";
      case 1: return "/hearts_1heart-removebg-preview.png";
      case 0: return "/hearts_0hearts-removebg-preview.png";
      default: return "/hearts_3hearts-removebg-preview.png";
    }
  };

  const getSheepImage = () => {
    switch (hearts) {
      case 3: return "/sheep1_happy-removebg-preview.png";
      case 2: return "/sheep2_annoyed-removebg-preview.png";
      case 1: return "/sheep3_sick-removebg-preview.png";
      case 0: return "/sheep4_dead-removebg-preview.png";
      default: return "/sheep1_happy-removebg-preview.png";
    }
  };
    
  const handleCheckbox = () => {
    // User completed their goal
    setCheckboxChecked(true);

    // Restore 1 heart if hearts < 3
    setHearts((prev) => (prev < 3 ? prev + 1 : prev));
  };

  
  // Heart-loss timer (demo 10s = 1 day)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!checkboxChecked && hearts > 0) {
        // Lose a heart if user missed the goal
        setHearts(prev => prev - 1);
        alert("You missed your goal! Heart lost.");
      }
      // Always reset checkbox for next cycle
      setCheckboxChecked(false);
    }, 10000); // every 10 seconds
  
    return () => clearInterval(interval);
  }, [checkboxChecked, hearts]);
  

  return (
    <div className="content">
      <h1 className="goal-title">{user.goal}</h1>

      {/* Hearts image */}
      <img
        src={getHeartsImage(hearts)}
        className="hearts"
        alt="health bar"
      />

      {/* Sheep image */}
      <img
        src={getSheepImage()}
        className="sheep"
        alt="sheep"
      />

      {/* Daily checkbox */}
      <label className="checkbox-container">
        <input
          type="checkbox"
          checked={checkboxChecked}
          onChange={handleCheckbox}
        />
        I worked on my goal today
      </label>
    </div>
  );
}