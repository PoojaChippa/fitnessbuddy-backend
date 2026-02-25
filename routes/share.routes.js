import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { generateShare } from "../controllers/share.controller.js";

const router = express.Router();

router.post("/", protect, generateShare);

export default router;
