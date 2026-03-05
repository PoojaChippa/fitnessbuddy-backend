import * as workoutModel from "../models/workout.model.js";
import { successResponse } from "../utils/apiResponse.js";

/* =========================
   ADD WORKOUT
========================= */
export const addWorkout = async (req, res, next) => {
  try {
    const { type, duration } = req.body;

    const workout = await workoutModel.createWorkout({
      userId: req.user.id,
      type,
      duration,
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

export const getAnalytics = async (req, res, next) => {
  try {
    const data = await workoutModel.getWorkoutAnalytics({
      userId: req.user.id,
    });

    return successResponse(res, data);
  } catch (err) {
    next(err);
  }
};
