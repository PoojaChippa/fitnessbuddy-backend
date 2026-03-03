import * as workoutModel from "../models/workout.model.js";
import { successResponse } from "../utils/apiResponse.js";

/* =========================
   ADD WORKOUT
========================= */
export const addWorkout = async (req, res, next) => {
  try {
    const { type, duration } = req.body;

    // Simple calorie logic (can improve later)
    const calorieMap = {
      running: 10,
      cycling: 8,
      walking: 4,
      gym: 6,
    };

    const caloriesPerMin = calorieMap[type?.toLowerCase()] || 5;
    const calories = caloriesPerMin * Number(duration);

    const workout = await workoutModel.createWorkout({
      userId: req.user.id,
      type,
      duration,
      calories,
    });

    return successResponse(res, workout, 201);
  } catch (err) {
    next(err);
  }
};

/* =========================
   GET USER WORKOUTS
========================= */
export const getWorkouts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type } = req.query;

    const result = await workoutModel.getUserWorkouts({
      userId: req.user.id,
      page,
      limit,
      type,
    });

    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

/* =========================
   GET WORKOUT STATS
========================= */
export const getWorkoutStats = async (req, res, next) => {
  try {
    const stats = await workoutModel.getWorkoutStats({
      userId: req.user.id,
    });

    return successResponse(res, stats);
  } catch (err) {
    next(err);
  }
};

export const deleteWorkout = async (req, res, next) => {
  try {
    const { id } = req.params;

    await workoutModel.deleteWorkout({
      id,
      userId: req.user.id,
    });

    return successResponse(res, { message: "Workout deleted" });
  } catch (err) {
    next(err);
  }
};

import { getWorkoutAnalytics } from "../models/workout.model.js";

export const getAnalytics = async (req, res) => {
  try {
    const data = await getWorkoutAnalytics({
      userId: req.user.id,
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
