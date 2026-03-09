import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  updateProfile,
  getProfile,
  getAnalytics,
  getUserById,
} from "../controllers/user.controller.js";
const router = express.Router();

router.put("/", protect, updateProfile);
router.get("/", protect, getProfile);
router.get("/analytics", protect, getAnalytics);
router.get("/:id", protect, getUserById);
export default router;
