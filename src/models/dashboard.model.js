import { supabase } from "../config/supabase.js";

export const getDashboardData = async (userId) => {
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (userError) throw userError;

  const { data: workouts, error: workoutError } = await supabase
    .from("workouts")
    .select("duration, calories")
    .eq("user_id", userId);

  if (workoutError) throw workoutError;

  return {
    user,
    workouts: workouts || [],
  };
};
