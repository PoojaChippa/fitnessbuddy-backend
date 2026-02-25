import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createGroup,
  joinGroup,
  logGroupWorkout,
  groupProgress,
} from "../controllers/group.controller.js";

const router = express.Router();

router.post("/", protect, createGroup);
router.post("/join", protect, joinGroup);
router.post("/workout", protect, logGroupWorkout);
router.get("/:id/progress", protect, groupProgress);

export default router;
