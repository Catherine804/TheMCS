import express from "express";
import { prisma } from "../../prisma/client.js";

const router = express.Router();

// Create a new goal
router.post("/", async (req, res) => {
  const { userId, title, description, frequency, deadline } = req.body;

  if (!userId || !title || !frequency) {
    return res.status(400).json({ error: "userId, title, and frequency are required" });
  }

  try {
    const goal = await prisma.goal.create({
      data: {
        title,
        description: description || "",
        frequency,
        deadline: deadline ? new Date(deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        userId: Number(userId),
        status: "active",
        progressStatus: "in_progress"
      }
    });

    res.json(goal);
  } catch (err) {
    console.error("Error creating goal:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all goals for a user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const goals = await prisma.goal.findMany({
      where: { userId: Number(userId) }
    });

    res.json(goals);
  } catch (err) {
    console.error("Error fetching goals:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update a goal
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, frequency, deadline, status, progressStatus } = req.body;

  try {
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (frequency !== undefined) updateData.frequency = frequency;
    if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;
    if (status !== undefined) updateData.status = status;
    if (progressStatus !== undefined) updateData.progressStatus = progressStatus;

    const goal = await prisma.goal.update({
      where: { id: Number(id) },
      data: updateData
    });

    res.json(goal);
  } catch (err) {
    console.error("Error updating goal:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a goal
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.goal.delete({
      where: { id: Number(id) }
    });

    res.json({ message: "Goal deleted successfully" });
  } catch (err) {
    console.error("Error deleting goal:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
