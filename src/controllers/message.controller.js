import * as messageModel from "../models/message.model.js";

export const sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { receiver_id, text } = req.body;

    if (!receiver_id || !text) {
      return res.status(400).json({
        success: false,
        message: "Receiver and text are required",
      });
    }

    const message = await messageModel.sendMessage({
      senderId,
      receiverId: receiver_id,
      text,
    });

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (err) {
    next(err);
  }
};

export const getConversation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.params.userId;

    const messages = await messageModel.getConversation(userId, otherUserId);

    res.json({
      success: true,
      totalMessages: messages.length,
      data: messages,
    });
  } catch (err) {
    next(err);
  }
};
