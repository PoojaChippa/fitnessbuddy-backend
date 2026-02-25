import { supabase } from "../config/supabase.js";

export const sendMessage = async (payload) => {
  const { data, error } = await supabase
    .from("messages")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
};
