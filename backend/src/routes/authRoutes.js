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

export default router; 
