import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createChallenge,
  joinChallenge,
  logProgress,
  getProgress,
  getMyChallenges,
} from "../controllers/challenge.controller.js";

const router = express.Router();

router.post("/", protect, createChallenge);
router.post("/join", protect, joinChallenge);
router.post("/log", protect, logProgress);
router.get("/my", protect, getMyChallenges);
router.get("/:challengeId", protect, getProgress);

export default router;
