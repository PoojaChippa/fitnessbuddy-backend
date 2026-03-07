import { supabase } from "../config/supabase.js";

export const findMatches = async (currentUser) => {
  const { goal, workout_type, city, id } = currentUser;

  const { data, error } = await supabase
    .from("users")
    .select("id, goal, workout_type, city, gender")
    .eq("goal", goal)
    .eq("city", city)
    .neq("id", id);

  if (error) throw error;

  // Add compatibility score
  const matchesWithScore = data.map((user) => {
    let score = 80;

    if (user.workout_type === workout_type) {
      score += 20;
    }

    return {
      ...user,
      matchScore: score,
    };
  });

  return matchesWithScore;
};
