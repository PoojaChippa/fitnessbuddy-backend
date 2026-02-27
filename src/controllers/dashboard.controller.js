import { getDashboardData } from "../models/dashboard.model.js";

export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { user, workouts } = await getDashboardData(userId);

    const totalWorkouts = workouts.length;

    const totalCalories = workouts.reduce(
      (sum, w) => sum + (w.calories || 0),
      0,
    );

    const totalDuration = workouts.reduce(
      (sum, w) => sum + (w.duration || 0),
      0,
    );

    const heightMeters = user.height / 100;
    const currentBMI = user.weight / (heightMeters * heightMeters);

    // Fat loss calculation
    const weightLoss = totalCalories / 7700;
    const projectedWeight = user.weight - weightLoss;

    // Target weight from target BMI
    const targetWeight = user.target_bmi * (heightMeters * heightMeters);

    const weightToLose = user.weight - targetWeight;

    const caloriesNeeded = weightToLose > 0 ? weightToLose * 7700 : 0;

    // Estimate days
    let estimatedDays = null;

    if (totalWorkouts > 0) {
      const firstWorkoutDate = new Date(workouts[0].created_at);
      const lastWorkoutDate = new Date(
        workouts[workouts.length - 1].created_at,
      );

      const days =
        (lastWorkoutDate - firstWorkoutDate) / (1000 * 60 * 60 * 24) + 1;

      const avgCaloriesPerDay = days > 0 ? totalCalories / days : totalCalories;

      estimatedDays =
        avgCaloriesPerDay > 0
          ? Math.ceil(caloriesNeeded / avgCaloriesPerDay)
          : null;
    }

    res.json({
      success: true,
      data: {
        totalWorkouts,
        totalCalories,
        totalDuration,
        currentBMI: Number(currentBMI.toFixed(2)),
        projectedWeight: Number(projectedWeight.toFixed(2)),
        targetWeight: Number(targetWeight.toFixed(2)),
        caloriesNeeded: Math.ceil(caloriesNeeded),
        estimatedDaysToTarget: estimatedDays,
      },
    });
  } catch (err) {
    next(err);
  }
};
