import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { addWorkout, getWorkouts } from "../controllers/workout.controller.js";

const router = express.Router();

router.post("/", protect, addWorkout);
router.get("/", protect, getWorkouts);

export default router;
