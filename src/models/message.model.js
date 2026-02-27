import { supabase } from "../config/supabase.js";

export const sendMessage = async ({ senderId, receiverId, text }) => {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      text,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const getConversation = async (userId, otherUserId) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(
      `and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`,
    )
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data;
};
