import * as groupModel from "../models/group.model.js";

/* CREATE */
export const createGroup = async (req, res, next) => {
  try {
    const { name, goal_type, target_value } = req.body;

    const group = await groupModel.createGroup({
      name,
      goal_type,
      target_value,
      ownerId: req.user.id,
    });

    res.status(201).json({ success: true, data: group });
  } catch (err) {
    next(err);
  }
};

/* JOIN */
export const joinGroup = async (req, res, next) => {
  try {
    const { group_id } = req.body;

    const member = await groupModel.joinGroup({
      groupId: group_id,
      userId: req.user.id,
    });

    res.json({
      success: true,
      data: member,
    });
  } catch (err) {
    next(err);
  }
};

/* LOG WORKOUT */
export const logGroupWorkout = async (req, res, next) => {
  try {
    const { group_id, type, duration, calories } = req.body;

    const workout = await groupModel.logGroupWorkout({
      groupId: group_id,
      userId: req.user.id,
      type,
      duration,
      calories,
    });

    res.json({
      success: true,
      data: workout,
    });
  } catch (err) {
    next(err);
  }
};

/* GROUP PROGRESS */
export const getGroupProgress = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;

    const progress = await groupModel.getGroupProgress(groupId);

    res.json({
      success: true,
      data: progress,
    });
  } catch (err) {
    next(err);
  }
};

/* MY GROUPS */
export const getMyGroups = async (req, res, next) => {
  try {
    const groups = await groupModel.getMyGroups(req.user.id);

    res.json({
      success: true,
      data: groups,
    });
  } catch (err) {
    next(err);
  }
};

/*GET GROUP DAILY STATS */
export const getGroupStats = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;

    const stats = await groupModel.getGroupDailyStats(groupId);

    res.json({
      success: true,
      data: stats,
    });
  } catch (err) {
    next(err);
  }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const leaderboard = await groupModel.getGroupLeaderboard(groupId);

    res.json({
      success: true,
      count: leaderboard.length,
      data: leaderboard,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteGroup = async (req, res, next) => {
  try {
    console.log("Deleting group:", req.params.groupId);
    console.log("User ID:", req.user.id);

    await groupModel.deleteGroup({
      groupId: req.params.groupId,
      userId: req.user.id,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE CONTROLLER ERROR:", err);
    next(err);
  }
};
