
import { useState, useEffect } from "react";
import "./App.css";
import Goal from "./Goal.jsx"

function App({ user, setUser }) {
  const [hearts, setHearts] = useState(3); // 3 = full health
  const [checkboxChecked, setCheckboxChecked] = useState(false);

   // Function to map hearts to image paths
  const getHeartsImage = (hearts) => {
    switch (hearts) {
      case 3: return "/hearts_3hearts-removebg-preview.png";
      case 2: return "/hearts_2hearts-removebg-preview.png";
      case 1: return "/hearts_1heart-removebg-preview.png";
      case 0: return "/hearts_0hearts-removebg-preview.png";
      default: return "/hearts_3hearts-removebg-preview.png";
    }
  };

  // Determine sheep image based on hearts
  const getSheepImage = () => {
    switch (hearts) {
      case 3:
        return "/sheep1_happy-removebg-preview.png";
      case 2:
        return "/sheep2_annoyed-removebg-preview.png";
      case 1:
        return "/sheep3_sick-removebg-preview.png";
      case 0:
        return "/sheep4_dead-removebg-preview.png";
      default:
        return "/sheep1_happy-removebg-preview.png";
    }
  };

  // Handle daily checkbox
    const handleCheckbox = () => setCheckboxChecked(true);


  // Lose heart if checkbox not checked in time
  useEffect(() => {
    const interval = setInterval(() => {
      if (!checkboxChecked && hearts > 0) {
        setHearts(prev => prev - 1);
        alert("You missed your goal! Heart lost.");
      }
      // Reset checkbox for next cycle
      setCheckboxChecked(false);
    }, 10000); // every 10 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, [checkboxChecked, hearts]);

  return (
    <div className="app-container">
      <img
        src="/background_day.png"
        className="background-image"
        alt="background"
      />

      <div className="content">
        <h1 className="goal-title">Goal Tracker</h1>

        {/* Goal input */}
        <Goal user={user} setUser={setUser} />

        {/* Hearts */}
        <img
          src={getHeartsImage(hearts)}
          className="hearts"
          alt="health bar"
        />

        {/* Sheep */}
        <img src={getSheepImage()} className="sheep" alt="sheep" />

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
    </div>
  );
}

export default App;