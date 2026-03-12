import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createChallenge,
  joinChallenge,
  logProgress,
  getProgress,
  getMyChallenges,
  getAllChallenges,
  getLeaderboard,
} from "../controllers/challenge.controller.js";

const router = express.Router();

router.post("/", protect, createChallenge);
router.post("/join", protect, joinChallenge);
router.post("/log", protect, logProgress);
router.get("/my", protect, getMyChallenges);
router.get("/:challengeId", protect, getProgress);
router.get("/", protect, getAllChallenges);
router.get("/leaderboard/:challengeId", protect, getLeaderboard);
export default router;
