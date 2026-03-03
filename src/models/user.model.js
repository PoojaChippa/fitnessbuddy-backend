import { supabase } from "../config/supabase.js";
import {
  calculateBMI,
  calculateWeightLossFromCalories,
  calculateTargetWeight,
  calculateEstimatedDays,
} from "../utils/bmi.js";

/* =========================
   UPDATE PROFILE
========================= */
export const updateProfile = async ({ userId, updates }) => {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
};

/* =========================
   GET USER BY ID
========================= */
export const getById = async (id) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
};

/* =========================
   GET ALL USERS
========================= */
export const getUserAnalytics = async (userId) => {
  // Get user
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (userError) throw userError;

  const { height, weight, target_bmi } = user;

  if (!height || !weight) {
    return { error: "Height and weight required" };
  }

  // Get workouts
  const { data: workouts, error: workoutError } = await supabase
    .from("workouts")
    .select("calories, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (workoutError) throw workoutError;

  const totalCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0);

  //  Weight simulation
  const weightLoss = calculateWeightLossFromCalories(totalCalories);
  const simulatedWeight = weight - weightLoss;

  const currentBMI = calculateBMI(weight, height);
  const simulatedBMI = calculateBMI(simulatedWeight, height);

  let estimatedDays = null;
  let weightToLose = null;

  if (target_bmi) {
    const targetWeight = calculateTargetWeight(target_bmi, height);

    weightToLose = weight - targetWeight;

    if (weightToLose > 0) {
      const caloriesNeeded = weightToLose * 7700;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentWorkouts = workouts.filter(
        (w) => new Date(w.created_at) >= sevenDaysAgo,
      );

      const recentCalories = recentWorkouts.reduce(
        (sum, w) => sum + (w.calories || 0),
        0,
      );

      const avgDailyBurn = recentCalories / 7;

      estimatedDays = calculateEstimatedDays(caloriesNeeded, avgDailyBurn);
    } else {
      estimatedDays = 0;
    }
  }

  return {
    currentBMI,
    simulatedBMI,
    targetBMI: target_bmi,
    totalCaloriesBurned: totalCalories,
    simulatedWeight: Number(simulatedWeight.toFixed(2)),
    weightToLose:
      weightToLose && weightToLose > 0 ? Number(weightToLose.toFixed(2)) : 0,
    estimatedDaysToTarget: estimatedDays,
  };
};
