import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { findGyms } from "../controllers/gym.controller.js";

const router = express.Router();

router.get("/", protect, findGyms);

export default router;
