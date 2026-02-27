import { supabase } from "../config/supabase.js";
import { findMatches } from "../models/match.model.js";

export const getMatches = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get current user profile
    const { data: currentUser, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    if (!currentUser.goal || !currentUser.workout_type || !currentUser.city) {
      return res.status(400).json({
        success: false,
        message: "Complete your profile before matching",
      });
    }

    const matches = await findMatches(currentUser);

    res.json({
      success: true,
      totalMatches: matches.length,
      data: matches,
    });
  } catch (err) {
    next(err);
  }
};
