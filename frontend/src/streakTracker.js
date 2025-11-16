// streakTracker.js - Utility for tracking user streaks

/**
 * Get the streak data for a user
 * @param {number} userId - The user's ID
 * @returns {Object} - Streak data { currentStreak, longestStreak, lastCheckInDate, totalDaysActive }
 */
export const getStreakData = (userId) => {
  const key = `streak_${userId}`;
  const saved = localStorage.getItem(key);
  
  if (!saved) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastCheckInDate: null,
      totalDaysActive: 0
    };
  }
  
  try {
    return JSON.parse(saved);
  } catch (err) {
    console.error("Failed to parse streak data:", err);
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastCheckInDate: null,
      totalDaysActive: 0
    };
  }
};

/**
 * Save streak data for a user
 * @param {number} userId - The user's ID
 * @param {Object} streakData - The streak data to save
 */
export const saveStreakData = (userId, streakData) => {
  const key = `streak_${userId}`;
  localStorage.setItem(key, JSON.stringify(streakData));
};

/**
 * Check if a date is today
 * @param {string} dateString - ISO date string
 * @returns {boolean}
 */
const isToday = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if a date is yesterday
 * @param {string} dateString - ISO date string
 * @returns {boolean}
 */
const isYesterday = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Update the streak when user works on any goal
 * This is called when ANY goal checkbox is checked, but only updates once per day
 * @param {number} userId - The user's ID
 * @returns {Object} - Updated streak data { data, increased: boolean }
 */
export const updateStreak = (userId) => {
  const streakData = getStreakData(userId);
  const now = new Date().toISOString();
  
  let increased = false;
  
  // If already checked in today, don't update but return current data
  if (isToday(streakData.lastCheckInDate)) {
    return { data: streakData, increased: false };
  }
  
  // If last check-in was yesterday, increment streak
  if (isYesterday(streakData.lastCheckInDate)) {
    streakData.currentStreak += 1;
    increased = true;
  } else if (streakData.lastCheckInDate) {
    // If last check-in was more than 1 day ago, reset streak
    streakData.currentStreak = 1;
    increased = true;
  } else {
    // First time checking in
    streakData.currentStreak = 1;
    increased = true;
  }
  
  // Update longest streak if current streak is higher
  if (streakData.currentStreak > streakData.longestStreak) {
    streakData.longestStreak = streakData.currentStreak;
  }
  
  // Update total days active
  streakData.totalDaysActive += 1;
  
  // Update last check-in date
  streakData.lastCheckInDate = now;
  
  // Save updated data
  saveStreakData(userId, streakData);
  
  return { data: streakData, increased };
};

/**
 * Check and update streak status (call this on app load to handle missed days)
 * @param {number} userId - The user's ID
 * @returns {Object} - Current streak data (with potential reset if streak broken)
 */
export const checkStreakStatus = (userId) => {
  const streakData = getStreakData(userId);
  
  // If no last check-in, return as is
  if (!streakData.lastCheckInDate) {
    return streakData;
  }
  
  // If today or yesterday, streak is still valid
  if (isToday(streakData.lastCheckInDate) || isYesterday(streakData.lastCheckInDate)) {
    return streakData;
  }
  
  // If more than 1 day has passed, reset current streak
  if (streakData.currentStreak > 0) {
    streakData.currentStreak = 0;
    saveStreakData(userId, streakData);
  }
  
  return streakData;
};

/**
 * Get motivational message based on streak
 * @param {number} streak - Current streak count
 * @returns {string} - Motivational message
 */
export const getStreakMessage = (streak) => {
  if (streak === 0) {
    return "Start your streak today! 🌟";
  } else if (streak === 1) {
    return "Great start! Keep it going! 💪";
  } else if (streak < 7) {
    return `${streak} days strong! You're building momentum! 🔥`;
  } else if (streak < 14) {
    return `${streak} day streak! You're on fire! 🔥🔥`;
  } else if (streak < 30) {
    return `Amazing ${streak} day streak! You're unstoppable! 🚀`;
  } else {
    return `Incredible ${streak} day streak! You're a legend! 👑`;
  }
};
