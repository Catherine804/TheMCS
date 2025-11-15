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

  const handleCheckbox = () => setCheckboxChecked(true);

  // Heart-loss timer (demo 10s = 1 day)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!checkboxChecked && hearts > 0) setHearts(prev => prev - 1);
      setCheckboxChecked(false); // reset for next cycle
    }, 10000);

    return () => clearInterval(interval);
  }, [checkboxChecked, hearts]);

  return (
    <div className="content">
      <h1 className="goal-title">{user.goal}</h1>

      <img
        src={getHeartsImage(hearts)}
        className="hearts"
        alt="health bar"
      />
      <img src={getSheepImage()} className="sheep" alt="sheep" />

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
