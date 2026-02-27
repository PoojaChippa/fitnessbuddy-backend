import { supabase } from "../config/supabase.js";

/* =========================
   UPDATE PROFILE
========================= */
export const updateProfile = async ({ userId, updates }) => {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
};

/* =========================
   GET USER BY ID
========================= */
export const getById = async (id) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
};

/* =========================
   GET ALL USERS
========================= */
export const getAll = async () => {
  const { data, error } = await supabase.from("users").select("*");

  if (error) throw error;

  return data;
};
