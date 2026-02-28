import { getDashboardData } from "../models/dashboard.model.js";

export const getDashboard = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { user, workouts } = await getDashboardData(req.user.id);

    const totalWorkouts = workouts?.length || 0;

    const totalCalories =
      workouts?.reduce((sum, w) => sum + (w.calories || 0), 0) || 0;

    const totalDuration =
      workouts?.reduce((sum, w) => sum + (w.duration || 0), 0) || 0;

    let currentBMI = null;

    if (user?.height && user?.weight) {
      currentBMI = (user.weight / (user.height / 100) ** 2).toFixed(1);
    }

    return res.status(200).json({
      totalWorkouts,
      totalCalories,
      totalDuration,
      currentBMI,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    next(err);
  }
};
