import * as challengeModel from "../models/challenge.model.js";

/* CREATE */
export const createChallenge = async (req, res, next) => {
  try {
    const { title, description, goal_type, target_value } = req.body;

    const challenge = await challengeModel.createChallenge({
      title,
      description,
      goal_type,
      target_value,
      owner_id: req.user.id,
    });
    await challengeModel.joinChallenge({
      challengeId: challenge.id,
      userId: req.user.id,
    });
    res.status(201).json({ success: true, data: challenge });
  } catch (err) {
    next(err);
  }
};

/* JOIN */
export const joinChallenge = async (req, res, next) => {
  try {
    const { challenge_id } = req.body;

    const membership = await challengeModel.joinChallenge({
      challengeId: challenge_id,
      userId: req.user.id,
    });

    res.json({ success: true, data: membership });
  } catch (err) {
    next(err);
  }
};

/* LOG PROGRESS */
export const logProgress = async (req, res, next) => {
  try {
    const { challenge_id, progress_value } = req.body;

    const log = await challengeModel.logProgress({
      challengeId: challenge_id,
      userId: req.user.id,
      progress: progress_value,
    });

    res.json({ success: true, data: log });
  } catch (err) {
    next(err);
  }
};

/* SINGLE PROGRESS */
export const getProgress = async (req, res, next) => {
  try {
    const challengeId = req.params.challengeId;

    const progress = await challengeModel.getChallengeProgress(
      challengeId,
      req.user.id,
    );

    res.json({ success: true, data: progress });
  } catch (err) {
    next(err);
  }
};

/* MY CHALLENGES */
export const getMyChallenges = async (req, res, next) => {
  try {
    const challenges = await challengeModel.getUserChallenges(req.user.id);

    res.json({ success: true, data: challenges });
  } catch (err) {
    next(err);
  }
  console.log("JWT User ID:", req.user.id);
};
