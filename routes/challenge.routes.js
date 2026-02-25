import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createChallenge,
  joinChallenge,
  logChallengeProgress,
  getMyChallenges,
  challengeProgress,
} from "../controllers/challenge.controller.js";

const router = express.Router();

router.post("/", protect, createChallenge);
router.post("/join", protect, joinChallenge);
router.post("/log", protect, logChallengeProgress);
router.get("/", protect, getMyChallenges);
router.get("/:id/progress", protect, challengeProgress);

export default router;
