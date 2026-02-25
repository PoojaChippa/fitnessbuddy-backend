import { supabase } from "../config/supabase.js";

export const createProfile = async (payload) => {
  const { data, error } = await supabase
    .from("users")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getById = async (id) => {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
  return data;
};

export const getAll = async () => {
  const { data } = await supabase.from("users").select("*");
  return data;
};
