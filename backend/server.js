import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";


dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.use("/users", userRoutes);

app.use("/auth", authRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));

/**
// New code:

/**
 * GET /user/:id → fetch current pet state and tasks


app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        pet: true,
        tasks: true,
      },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /user/:id/task → mark task complete for today

app.post("/user/:id/task", async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  const today = new Date();
  try {
    const task = await prisma.task.create({
      data: {
        userId: Number(id),
        description,
        date: today,
        completed: true,
      },
    });

    // Update pet state if needed
    const pet = await prisma.pet.findUnique({ where: { userId: Number(id) } });
    if (pet) {
      await prisma.pet.update({
        where: { id: pet.id },
        data: {
          hearts: Math.min(pet.hearts + 1, 3), // Example: heal 1 heart for task completion
          lastUpdated: new Date(),
        },
      });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /user/:id/reset → reset hearts/daily tasks

app.post("/user/:id/reset", async (req, res) => {
  const { id } = req.params;
  try {
    const pet = await prisma.pet.findUnique({ where: { userId: Number(id) } });
    if (pet) {
      const updatedPet = await prisma.pet.update({
        where: { id: pet.id },
        data: { hearts: 3, state: "happy", lastUpdated: new Date() },
      });
      res.json(updatedPet);
    } else {
      res.status(404).json({ message: "Pet not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
*/

