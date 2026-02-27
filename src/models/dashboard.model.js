import { supabase } from "../config/supabase.js";

export const getDashboardData = async (userId) => {
  // Get user profile
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (userError) throw userError;

  // Get workouts
  const { data: workouts, error: workoutError } = await supabase
    .from("workouts")
    .select("duration, calories, created_at")
    .eq("user_id", userId);

  if (workoutError) throw workoutError;

  return { user, workouts };
};
