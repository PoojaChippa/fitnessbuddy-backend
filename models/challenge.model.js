import { supabase } from "../config/supabase.js";

export const createChallenge = async (payload) => {
  const { data, error } = await supabase
    .from("challenges")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const joinChallenge = async (payload) => {
  const { data, error } = await supabase
    .from("challenge_members")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const logProgress = async (payload) => {
  const { data, error } = await supabase
    .from("challenge_logs")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getUserChallenges = async (userId) => {
  const { data } = await supabase
    .from("challenge_members")
    .select("challenge_id, challenges(*)")
    .eq("user_id", userId);
  return data;
};

export const getChallengeProgress = async (id) => {
  const { data } = await supabase
    .from("challenge_logs")
    .select("progress_value")
    .eq("challenge_id", id);
  return data;
};
