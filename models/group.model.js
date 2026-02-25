import { supabase } from "../config/supabase.js";

export const createGroup = async (payload) => {
  const { data, error } = await supabase
    .from("groups")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const addMember = async (payload) => {
  const { data, error } = await supabase
    .from("group_members")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const addGroupWorkout = async (payload) => {
  const { data, error } = await supabase
    .from("group_workouts")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getGroupProgress = async (groupId) => {
  const { data } = await supabase
    .from("group_workouts")
    .select("calories")
    .eq("group_id", groupId);
  return data;
};
