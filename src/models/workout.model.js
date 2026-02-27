import { supabase } from "../config/supabase.js";

/* =========================
   CREATE WORKOUT
========================= */

export const createWorkout = async ({ userId, type, duration, calories }) => {
  if (!userId) throw new Error("User ID is required");
  if (!type) throw new Error("Workout type is required");

  const payload = {
    user_id: userId,
    type,
    duration: duration ?? 0,
    calories: calories ?? 0,
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
