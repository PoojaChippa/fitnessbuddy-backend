import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  addWorkout,
  getWorkouts,
  getWorkoutStats,
  deleteWorkout,
} from "../controllers/workout.controller.js";

const router = express.Router();

router.post("/", protect, addWorkout);
router.get("/", protect, getWorkouts);
router.get("/stats", protect, getWorkoutStats);
router.delete("/:id", protect, deleteWorkout);

export default router;
