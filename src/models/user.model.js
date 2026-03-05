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
export const getUserAnalytics = async (userId) => {
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (userError) throw userError;

  const { height, weight, target_bmi } = user;

  if (!height || !weight || !target_bmi) {
    return { error: "Height, weight and target BMI required" };
  }

  /* =========================
     GET WORKOUT DATA
  ========================= */

  const { data: workouts, error: workoutError } = await supabase
    .from("workouts")
    .select("calories, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (workoutError) throw workoutError;

  const totalCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0);

  /* =========================
     BMI CALCULATIONS
  ========================= */

  const currentBMI = calculateBMI(weight, height);

  const weightLossFromCalories = calculateWeightLossFromCalories(totalCalories);

  const simulatedWeight = weight - weightLossFromCalories;

  const simulatedBMI = calculateBMI(simulatedWeight, height);

  /* =========================
     TARGET WEIGHT
  ========================= */

  const targetWeight = calculateTargetWeight(target_bmi, height);

  let weightToLose = null;
  let weightToGain = null;
  let estimatedDays = null;

  const difference = targetWeight - weight;

  /* =========================
     AVG DAILY BURN
  ========================= */

  const avgDailyBurn =
    workouts.length > 0 ? totalCalories / workouts.length : 300;

  /* =========================
     WEIGHT LOSS
  ========================= */

  if (difference < 0) {
    weightToLose = Math.abs(difference);

    const caloriesNeeded = weightToLose * 7700;

    estimatedDays = calculateEstimatedDays(caloriesNeeded, avgDailyBurn);
  }

  /* =========================
     WEIGHT GAIN
  ========================= */

  if (difference > 0) {
    weightToGain = difference;

    const weeklyGain = 0.4;

    estimatedDays = Math.ceil((weightToGain / weeklyGain) * 7);
  }

  /* =========================
     RETURN ANALYTICS
  ========================= */

  return {
    currentBMI,
    simulatedBMI,
    targetBMI: target_bmi,

    totalCaloriesBurned: totalCalories,

    simulatedWeight: Number(simulatedWeight.toFixed(2)),

    weightToLose: weightToLose ? Number(weightToLose.toFixed(2)) : null,

    weightToGain: weightToGain ? Number(weightToGain.toFixed(2)) : null,

    estimatedDaysToTarget: estimatedDays,
  };
};
