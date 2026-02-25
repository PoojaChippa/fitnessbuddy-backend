import * as userModel from "../models/user.model.js";
import { calculateBMI } from "../utils/bmi.js";

export const createProfile = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      id: req.user.id,
      bmi: calculateBMI(req.body.weight, req.body.height),
    };
    const user = await userModel.createProfile(payload);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res) => {
  const user = await userModel.getById(req.user.id);
  res.json(user);
};
