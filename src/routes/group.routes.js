import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createGroup,
  joinGroup,
  logGroupWorkout,
  getGroupProgress,
  getMyGroups,
  getGroupStats,
  getLeaderboard,
  deleteGroup,
  checkMembership,
  leaveGroup,
  getGroupMembers,
} from "../controllers/group.controller.js";

const router = express.Router();

router.post("/", protect, createGroup);
router.post("/join", protect, joinGroup);
router.post("/workout", protect, logGroupWorkout);
router.get("/my", protect, getMyGroups);
router.get("/:groupId/stats", protect, getGroupStats);
router.get("/:groupId/progress", protect, getGroupProgress);
router.get("/:groupId/leaderboard", protect, getLeaderboard);
router.delete("/:groupId", protect, deleteGroup);
router.get("/:groupId/is-member", protect, checkMembership);
router.delete("/:groupId/leave", protect, leaveGroup);
router.get("/:groupId/members", protect, getGroupMembers);

export default router;
