import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { findMatches } from "../controllers/match.controller.js";

const router = express.Router();

router.get("/", protect, findMatches);

export default router;
