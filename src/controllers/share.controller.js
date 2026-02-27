import * as shareModel from "../models/share.model.js";

/* SHARE PROGRESS */
export const shareProgress = async (req, res, next) => {
  try {
    const { receiver_id, share_type, reference_id } = req.body;

    const share = await shareModel.createShare({
      senderId: req.user.id,
      receiverId: receiver_id,
      shareType: share_type,
      referenceId: reference_id,
    });

    res.status(201).json({
      success: true,
      data: share,
    });
  } catch (err) {
    next(err);
  }
};

/* GET MY SHARE FEED */
export const getMyFeed = async (req, res, next) => {
  try {
    const shares = await shareModel.getMyShares(req.user.id);

    res.json({
      success: true,
      data: shares,
    });
  } catch (err) {
    next(err);
  }
};
