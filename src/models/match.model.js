import { supabase } from "../config/supabase.js";

export const findMatches = async (currentUser) => {
  const { goal, workout_type, city, id } = currentUser;

  const { data, error } = await supabase
    .from("users")
    .select("id, goal, workout_type, city, gender")
    .eq("goal", goal)
    .eq("workout_type", workout_type)
    .eq("city", city)
    .neq("id", id);

  if (error) throw error;

  return data;
};
