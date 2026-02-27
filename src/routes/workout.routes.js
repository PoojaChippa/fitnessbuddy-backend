import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  addWorkout,
  getWorkouts,
  getWorkoutStats,
} from "../controllers/workout.controller.js";

const router = express.Router();

router.post("/", protect, addWorkout); // FIXED
router.get("/", protect, getWorkouts);
router.get("/stats", protect, getWorkoutStats);

export default router;
