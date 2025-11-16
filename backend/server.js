import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import goalRoutes from "./src/routes/goalRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/goals", goalRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));

