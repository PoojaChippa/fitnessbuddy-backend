import { supabase } from "../config/supabase.js";

/* =========================
   CREATE WORKOUT
========================= */

const CALORIE_MAP = {
  running: 10,
  cycling: 8,
  gym: 6,
  swimming: 11,
  walking: 4,
};

export const createWorkout = async ({ userId, type, duration }) => {
  if (!userId) throw new Error("User ID is required");
  if (!type) throw new Error("Workout type is required");
  if (!duration) throw new Error("Duration is required");

  const caloriesPerMin = CALORIE_MAP[type.toLowerCase()] || 5;
  const calories = duration * caloriesPerMin;

  const payload = {
    user_id: userId,
    type,
    duration,
    calories,
  };

  const { data, error } = await supabase
    .from("workouts")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return data;
};

/* =========================
   GET USER WORKOUTS
========================= */

export const getUserWorkouts = async ({
  userId,
  page = 1,
  limit = 10,
  type,
}) => {
  if (!userId) throw new Error("User ID is required");

  page = Number(page);
  limit = Number(limit);

  if (Number.isNaN(page) || page < 1) page = 1;
  if (Number.isNaN(limit) || limit < 1) limit = 10;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("workouts")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) throw error;

  return {
    workouts: data,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};

/* =========================
   WORKOUT STATS
========================= */

export const getWorkoutStats = async ({ userId }) => {
  if (!userId) throw new Error("User ID is required");

  const { data, error } = await supabase
    .from("workouts")
    .select("duration, calories")
    .eq("user_id", userId);

  if (error) throw error;

  const totalWorkouts = data.length;

  const totalCalories = data.reduce((sum, w) => sum + (w.calories ?? 0), 0);

  const totalDuration = data.reduce((sum, w) => sum + (w.duration ?? 0), 0);

  return {
    totalWorkouts,
    totalCalories,
    totalDuration,
  };
};

/* =========================
   DELETE WORKOUT
========================= */

export const deleteWorkout = async ({ id, userId }) => {
  if (!id) throw new Error("Workout ID is required");
  if (!userId) throw new Error("User ID is required");

  const { error } = await supabase
    .from("workouts")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;

  return true;
};

export const getWorkoutAnalytics = async ({ userId }) => {
  if (!userId) throw new Error("User ID is required");

  const { data, error } = await supabase
    .from("workouts")
    .select("duration, calories, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  if (!data.length) {
    return {
      weeklyCalories: 0,
      monthlyCalories: 0,
      streak: 0,
      totalWorkouts: 0,
    };
  }

  const now = new Date();

  let weeklyCalories = 0;
  let monthlyCalories = 0;

  const workoutDates = [];

  data.forEach((w) => {
    const date = new Date(w.created_at);
    workoutDates.push(date);

    const diffDays = (now - date) / (1000 * 60 * 60 * 24);

    if (diffDays <= 7) {
      weeklyCalories += w.calories || 0;
    }

    if (diffDays <= 30) {
      monthlyCalories += w.calories || 0;
    }
  });

  // Calculate streak
  let streak = 1;

  for (let i = workoutDates.length - 1; i > 0; i--) {
    const diff =
      (workoutDates[i] - workoutDates[i - 1]) / (1000 * 60 * 60 * 24);

    if (diff <= 1.5) {
      streak++;
    } else {
      break;
    }
  }

  return {
    weeklyCalories,
    monthlyCalories,
    streak,
    totalWorkouts: data.length,
  };
};
