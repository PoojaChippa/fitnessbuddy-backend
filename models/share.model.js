import { supabase } from "../config/supabase.js";

export const createShareLink = async (payload) => {
  const { data, error } = await supabase
    .from("shares")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
};
