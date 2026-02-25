import { supabase } from "../config/supabase.js";

export const getMatches = async (goal, workout) => {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("goal", goal)
    .eq("workout_type", workout);
  return data;
};
