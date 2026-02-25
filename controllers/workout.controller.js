import * as workoutModel from "../models/workout.model.js";

export const addWorkout = async (req, res, next) => {
  try {
    const workout = await workoutModel.createWorkout({
      ...req.body,
      user_id: req.user.id,
    });
    res.json(workout);
  } catch (err) {
    next(err);
  }
};

export const getWorkouts = async (req, res) => {
  const data = await workoutModel.getUserWorkouts(req.user.id);
  res.json(data);
};
