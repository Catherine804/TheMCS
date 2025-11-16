/*import express from "express";
import prisma from "../../prisma/client.js";

const router = express.Router();

// Simple "login or register" by username
router.post("/", async (req, res) => {
  console.log("Auth route hit!"); // Add this
  console.log("prisma:", prisma); // Add this
  
  const { user_name } = req.body;

  if (!user_name) {
    return res.status(400).json({ error: "Username required" });
  }

  try {
    console.log("Looking for user:", user_name); // Add this
    
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { user_name },
    });

    console.log("User found:", user); // Add this

    // If not, create new user
    if (!user) {
      user = await prisma.user.create({
        data: { user_name, goal: "" },
      });
    }

    res.json(user);
  } catch (err) {
    console.error("Error in auth route:", err); // Add this
    res.status(500).json({ error: err.message });
  }
});

export default router;





*/
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





/*import express from "express";
import { prisma } from "../../prisma/client.js";

const router = express.Router();

// Simple "login or register" by username
router.post("/", async (req, res) => {
  const { user_name } = req.body;

  if (!user_name) {
    return res.status(400).json({ error: "Username required" });
  }

  try {
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { user_name }
    });

    // If not, create new user
    if (!user) {
      user = await prisma.user.create({
        data: { user_name }
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

export default router; */

/*import express from "express";
import { prisma } from "../../prisma/client.js";

const router = express.Router();

// Simple "login or register" by username
router.post("/", async (req, res) => {
  const { user_name } = req.body;

  if (!user_name) {
    return res.status(400).json({ error: "Username required" });
  }

  try {
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { user_name },
      include: { 
        goals: true // Get all goals
      }
    });

    // If not, create new user
    if (!user) {
      user = await prisma.user.create({
        data: { user_name },
        include: { goals: true }
      });
    }

    // Count active and completed goals
    const activeGoals = user.goals.filter(g => g.status === "active");
    const completedGoals = user.goals.filter(g => g.status === "completed");

    // Determine if truly new user (never created a goal)
    const isNewUser = user.goals.length === 0;

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

export default router; */



/*import express from "express";
import prisma from "../../prisma/client.js";
const router = express.Router();

// Simple "login or register" by username
router.post("/", async (req, res) => {
  const { user_name } = req.body;

  if (!user_name) {
    return res.status(400).json({ error: "Username required" });
  }

  try {
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { user_name },
    });

    // If not, create new user
    if (!user) {
      user = await prisma.user.create({
        data: { user_name, goal: "" }, // goal empty for now
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;*/ 
