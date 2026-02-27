import { supabase } from "../config/supabase.js";

export const createShare = async ({
  senderId,
  receiverId,
  shareType,
  referenceId,
}) => {
  const { data, error } = await supabase
    .from("shares")
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      share_type: shareType,
      reference_id: referenceId,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const getMyShares = async (userId) => {
  const { data, error } = await supabase
    .from("shares")
    .select(
      `
      id,
      share_type,
      reference_id,
      created_at,
      sender:sender_id(id, city),
      receiver_id
    `,
    )
    .eq("receiver_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const enriched = await Promise.all(
    data.map(async (share) => {
      let details = null;

      if (share.share_type === "workout") {
        const { data: workout } = await supabase
          .from("workouts")
          .select("type, duration, calories")
          .eq("id", share.reference_id)
          .single();
        details = workout;
      }

      if (share.share_type === "challenge") {
        const { data: challenge } = await supabase
          .from("challenges")
          .select("title, target_value")
          .eq("id", share.reference_id)
          .single();
        details = challenge;
      }

      if (share.share_type === "group") {
        const { data: group } = await supabase
          .from("groups")
          .select("name, goal_type, target_value")
          .eq("id", share.reference_id)
          .single();
        details = group;
      }

      return {
        type: share.share_type,
        created_at: share.created_at,
        sender: share.sender,
        details,
      };
    }),
  );

  return enriched;
};
