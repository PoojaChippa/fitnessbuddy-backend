import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { updateProfile, getProfile } from "../controllers/user.controller.js";
const router = express.Router();

router.put("/", protect, updateProfile);
router.get("/", protect, getProfile);

export default router;
