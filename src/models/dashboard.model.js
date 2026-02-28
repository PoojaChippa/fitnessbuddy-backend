import { supabase } from "../config/supabase.js";

export const getDashboardData = async (userId) => {
  //  Get user
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (userError) throw userError;

  //  Get workouts
  const { data: workouts, error: workoutError } = await supabase
    .from("workouts")
    .select("duration, calories, created_at")
    .eq("user_id", userId);

  if (workoutError) throw workoutError;

  //  Calculate totals
  const totalWorkouts = workouts.length;

  const totalCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0);

  //  Calculate Current BMI
  let currentBMI = null;
  if (user.height && user.weight) {
    currentBMI = user.weight / Math.pow(user.height / 100, 2);
    currentBMI = Number(currentBMI.toFixed(1));
  }

  // Estimate weight loss
  // 7700 calories ≈ 1kg fat loss
  const weightLost = totalCalories / 7700;
  const projectedWeight = user.weight - weightLost;

  let projectedBMI = null;
  if (user.height) {
    projectedBMI = projectedWeight / Math.pow(user.height / 100, 2);
    projectedBMI = Number(projectedBMI.toFixed(1));
  }

  //  Days to reach target BMI
  let daysToTarget = null;

  if (user.targetBMI && currentBMI) {
    const bmiDifference = currentBMI - user.targetBMI;

    if (bmiDifference > 0 && totalCalories > 0) {
      const avgDailyCalories = totalCalories / (workouts.length || 1);

      const requiredWeightLoss =
        user.weight - user.targetBMI * Math.pow(user.height / 100, 2);

      const requiredCalories = requiredWeightLoss * 7700;

      daysToTarget = Math.ceil(requiredCalories / (avgDailyCalories || 1));
    }
  }

  return {
    totalWorkouts,
    totalCalories,
    currentBMI,
    targetBMI: user.targetBMI || null,
    projectedBMI,
    daysToTarget,
  };
};
