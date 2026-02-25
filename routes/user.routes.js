import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createProfile, getProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", protect, createProfile);
router.get("/", protect, getProfile);

export default router;
