import * as matchModel from "../models/match.model.js";
import * as userModel from "../models/user.model.js";

export const findMatches = async (req, res) => {
  const user = await userModel.getById(req.user.id);
  const matches = await matchModel.getMatches(user.goal, user.workout_type);
  res.json(matches.filter((m) => m.id !== user.id));
};
