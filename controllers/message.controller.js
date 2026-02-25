import * as messageModel from "../models/message.model.js";

export const sendMessage = async (req, res, next) => {
  try {
    const msg = await messageModel.sendMessage({
      sender_id: req.user.id,
      receiver_id: req.body.receiver_id,
      text: req.body.text,
    });
    res.json(msg);
  } catch (err) {
    next(err);
  }
};
