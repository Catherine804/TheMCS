import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// ➜ Create user
router.post("/", async (req, res) => {
  try {
    const { name, goal } = req.body;

    const user = await prisma.user.create({
      data: { name, goal },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➜ Get all users
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
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
