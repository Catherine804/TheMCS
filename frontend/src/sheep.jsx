// sheep.jsx - Sheep image utilities

/**
 * Get the sheep image based on goal position and heart state
 * @param {number} goalIndex - The index of the goal (0 = first goal, 1 = second, 2 = third)
 * @param {number} hearts - The number of hearts (0-3)
 * @returns {string} - Path to the sheep image
 */
export const getSheepImage = (goalIndex, hearts) => {
  // Determine sheep color based on goal position
  // Goal 1 (index 0): white sheep
  // Goal 2 (index 1): purple sheep
  // Goal 3 (index 2): blue sheep
  const sheepColor = goalIndex === 0 ? "" : goalIndex === 1 ? "_purple" : "_blue";
  
  // Determine sheep number based on hearts (matches existing pattern)
  // sheep1 = happy (3 hearts), sheep2 = annoyed (2 hearts), 
  // sheep3 = sick (1 heart), sheep4 = dead (0 hearts)
  let sheepNumber;
  let sheepState;
  switch (hearts) {
    case 3:
      sheepNumber = 1;
      sheepState = "happy";
      break;
    case 2:
      sheepNumber = 2;
      sheepState = "annoyed";
      break;
    case 1:
      sheepNumber = 3;
      sheepState = "sick";
      break;
    case 0:
      sheepNumber = 4;
      sheepState = "dead";
      break;
    default:
      sheepNumber = 1;
      sheepState = "happy";
  }
  
  // Construct image path
  // For white sheep (goal 1): sheep1_happy-removebg-preview.png, sheep2_annoyed-removebg-preview.png, etc.
  // For purple sheep (goal 2): sheep1_happy_purple-removebg-preview.png, sheep2_annoyed_purple-removebg-preview.png, etc.
  // For blue sheep (goal 3): sheep1_happy_blue-removebg-preview.png, sheep2_annoyed_blue-removebg-preview.png, etc.
  return `/sheep${sheepNumber}_${sheepState}${sheepColor}-removebg-preview.png`;
};

/**
 * Get hearts image based on heart count
 * @param {number} hearts - The number of hearts (0-3)
 * @returns {string} - Path to the hearts image
 */
export const getHeartsImage = (hearts) => {
  switch (hearts) {
    case 3:
      return "/hearts_3hearts-removebg-preview.png";
    case 2:
      return "/hearts_2hearts-removebg-preview.png";
    case 1:
      return "/hearts_1heart-removebg-preview.png";
    case 0:
      return "/hearts_0hearts-removebg-preview.png";
    default:
      return "/hearts_3hearts-removebg-preview.png";
  }
};

