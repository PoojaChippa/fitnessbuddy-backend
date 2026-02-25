import * as groupModel from "../models/group.model.js";

export const createGroup = async (req, res, next) => {
  try {
    const group = await groupModel.createGroup({
      name: req.body.name,
      goal: req.body.goal,
      owner_id: req.user.id,
    });

    await groupModel.addMember({
      group_id: group.id,
      user_id: req.user.id,
    });

    res.json(group);
  } catch (err) {
    next(err);
  }
};

export const joinGroup = async (req, res, next) => {
  try {
    const member = await groupModel.addMember({
      group_id: req.body.group_id,
      user_id: req.user.id,
    });
    res.json(member);
  } catch (err) {
    next(err);
  }
};

export const logGroupWorkout = async (req, res, next) => {
  try {
    const workout = await groupModel.addGroupWorkout({
      ...req.body,
      user_id: req.user.id,
    });
    res.json(workout);
  } catch (err) {
    next(err);
  }
};

export const groupProgress = async (req, res) => {
  const data = await groupModel.getGroupProgress(req.params.id);
  const totalCalories = data.reduce((a, b) => a + b.calories, 0);

  res.json({
    totalCalories,
    workouts: data.length,
  });
};
