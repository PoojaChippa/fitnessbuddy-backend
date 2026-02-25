import { supabase } from "../config/supabase.js";

export const createWorkout = async (payload) => {
  const { data, error } = await supabase
    .from("workouts")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getUserWorkouts = async (userId) => {
  const { data } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", userId);
  return data;
};
