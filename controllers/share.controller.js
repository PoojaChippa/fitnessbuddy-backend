import { nanoid } from "nanoid";
import * as shareModel from "../models/share.model.js";
import * as workoutModel from "../models/workout.model.js";

export const generateShare = async (req, res, next) => {
  try {
    const workouts = await workoutModel.getUserWorkouts(req.user.id);

    const linkId = nanoid(10);

    await shareModel.createShareLink({
      id: linkId,
      user_id: req.user.id,
    });

    res.json({
      shareUrl: `${process.env.CLIENT_URL}/share/${linkId}`,
      totalWorkouts: workouts.length,
    });
  } catch (err) {
    next(err);
  }
};
