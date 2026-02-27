import * as userModel from "../models/user.model.js";
import { calculateBMI } from "../utils/bmi.js";

/* =========================
   UPDATE USER PROFILE
========================= */
export const updateProfile = async (req, res, next) => {
  try {
    const {
      goal,
      workout_type,
      height,
      weight,
      gender,
      city,
      postal_code,
      target_bmi,
    } = req.body;

    // Calculate BMI only if height and weight provided
    let bmi;
    if (height && weight) {
      bmi = calculateBMI(weight, height);
    }

    const payload = {
      goal,
      workout_type,
      height,
      weight,
      gender,
      city,
      postal_code,
      target_bmi,
      ...(bmi !== undefined && { bmi }),
    };

    const user = await userModel.updateProfile({
      userId: req.user.id,
      updates: payload,
    });

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   GET USER PROFILE
========================= */
export const getProfile = async (req, res, next) => {
  try {
    const user = await userModel.getById(req.user.id);

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
