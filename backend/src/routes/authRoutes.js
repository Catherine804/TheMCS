import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

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
