import { getDashboardData } from "../models/dashboard.model.js";
export const getDashboard = async (req, res, next) => {
  try {
    const { user, workouts } = await getDashboardData(req.user.id);

    const totalWorkouts = workouts.length;

    const totalCalories = workouts.reduce(
      (sum, w) => sum + (w.calories || 0),
      0,
    );

    const totalDuration = workouts.reduce(
      (sum, w) => sum + (w.duration || 0),
      0,
    );

    const currentBMI = user?.bmi || null;
    const targetBMI = user?.target_bmi || null;

    res.json({
      totalWorkouts,
      totalCalories,
      totalDuration,
      currentBMI,
      targetBMI,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    next(err);
  }
};
