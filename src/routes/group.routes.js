import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createGroup,
  joinGroup,
  logGroupWorkout,
  getGroupProgress,
  getMyGroups,
  getGroupStats,
  getLeaderboard,
} from "../controllers/group.controller.js";

const router = express.Router();

router.post("/", protect, createGroup);
router.post("/join", protect, joinGroup);
router.post("/workout", protect, logGroupWorkout);
router.get("/my", protect, getMyGroups);
router.get("/:groupId/stats", protect, getGroupStats);
router.get("/:groupId/progress", protect, getGroupProgress);
router.get("/:groupId/leaderboard", protect, getLeaderboard);

export default router;
