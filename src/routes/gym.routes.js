import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getNearbyGyms } from "../controllers/gym.controller.js";

const router = express.Router();

router.get("/", protect, getNearbyGyms);

export default router;
