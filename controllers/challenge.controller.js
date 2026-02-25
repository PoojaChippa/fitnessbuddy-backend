import * as challengeModel from "../models/challenge.model.js";

export const createChallenge = async (req, res, next) => {
  try {
    const challenge = await challengeModel.createChallenge({
      ...req.body,
      owner_id: req.user.id,
    });

    await challengeModel.joinChallenge({
      challenge_id: challenge.id,
      user_id: req.user.id,
    });

    res.json(challenge);
  } catch (err) {
    next(err);
  }
};

export const joinChallenge = async (req, res, next) => {
  try {
    const member = await challengeModel.joinChallenge({
      challenge_id: req.body.challenge_id,
      user_id: req.user.id,
    });
    res.json(member);
  } catch (err) {
    next(err);
  }
};

export const logChallengeProgress = async (req, res, next) => {
  try {
    const log = await challengeModel.logProgress({
      challenge_id: req.body.challenge_id,
      user_id: req.user.id,
      progress_value: req.body.progress_value,
    });
    res.json(log);
  } catch (err) {
    next(err);
  }
};

export const getMyChallenges = async (req, res) => {
  const data = await challengeModel.getUserChallenges(req.user.id);
  res.json(data);
};

export const challengeProgress = async (req, res) => {
  const logs = await challengeModel.getChallengeProgress(req.params.id);
  const total = logs.reduce((sum, item) => sum + item.progress_value, 0);

  res.json({
    totalProgress: total,
    entries: logs.length,
  });
};
