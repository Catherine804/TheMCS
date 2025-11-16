import express from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../prisma/client.js";

const router = express.Router();

// Single endpoint for login/signup
router.post("/", async (req, res) => {
  const { user_name, password } = req.body;

  if (!user_name || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  try {
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { user_name }
    });

    if (user) {
      // User exists - verify password
      const validPassword = await bcrypt.compare(password, user.password);
      
      if (!validPassword) {
        return res.status(400).json({ error: "Invalid username or password" });
      }
    } else {
      // User doesn't exist - create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      
      user = await prisma.user.create({
        data: { 
          user_name,
          password: hashedPassword
        }
      });
    }

    // Fetch goals separately
    const allGoals = await prisma.goal.findMany({
      where: { userId: user.id }
    });

    // Count active and completed goals
    const activeGoals = allGoals.filter(g => g.status === "active");
    const completedGoals = allGoals.filter(g => g.status === "completed");

    // Determine if truly new user (never created a goal)
    const isNewUser = allGoals.length === 0;

    res.json({
      id: user.id,
      user_name: user.user_name,
      createdAt: user.createdAt,
      isNewUser,
      activeGoalsCount: activeGoals.length,
      completedGoalsCount: completedGoals.length,
      activeGoals,
      completedGoals
    });
  } catch (err) {
    console.error("Error in auth route:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
