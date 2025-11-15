import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();



// ➜ Create user
router.post("/", async (req, res) => {
  try {
    const { user_name } = req.body; // only username at login

    if (user_name) return res.status(400).json({ message: "Username required" });

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { user_name },
    });

    // If not, create user with empty goal
    if (!user) {
      user = await prisma.user.create({
        data: { user_name, goal: "" },
      });
    }

    res.json(user); // return the user object
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➜ Update user goal or completed status
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { goal, completed } = req.body;

    const updated = await prisma.user.update({
      where: { id: Number(id) },
      data: { goal, completed },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ➜ Delete user
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
