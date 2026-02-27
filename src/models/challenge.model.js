import { supabase } from "../config/supabase.js";

/* =========================
   CREATE CHALLENGE
========================= */
export const createChallenge = async (payload) => {
  const { data, error } = await supabase
    .from("challenges")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/* =========================
   JOIN CHALLENGE
========================= */
export const joinChallenge = async ({ challengeId, userId }) => {
  const { data, error } = await supabase
    .from("challenge_members")
    .insert({
      challenge_id: challengeId,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/* =========================
   LOG PROGRESS
========================= */
export const logProgress = async ({ challengeId, userId, progress }) => {
  const { data, error } = await supabase
    .from("challenge_logs")
    .insert({
      challenge_id: challengeId,
      user_id: userId,
      progress_value: progress,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/* =========================
   GET SINGLE CHALLENGE PROGRESS
========================= */
export const getChallengeProgress = async (challengeId, userId) => {
  const { data: challenge, error: cError } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", challengeId)
    .single();

  if (cError) throw cError;

  const { data: logs, error: lError } = await supabase
    .from("challenge_logs")
    .select("progress_value")
    .eq("challenge_id", challengeId)
    .eq("user_id", userId);

  if (lError) throw lError;

  const totalProgress = logs.reduce((sum, l) => sum + l.progress_value, 0);

  const percentage = (totalProgress / challenge.target_value) * 100;

  return {
    challengeId: challenge.id,
    title: challenge.title,
    targetValue: challenge.target_value,
    totalProgress,
    percentage: Math.min(100, Number(percentage.toFixed(2))),
  };
};

/* =========================
   GET ALL USER CHALLENGES
========================= */
export const getUserChallenges = async (userId) => {
  const { data: memberships, error } = await supabase
    .from("challenge_members")
    .select("challenge_id, challenges(*)")
    .eq("user_id", userId);

  if (error) throw error;

  if (!memberships.length) return [];

  const challengeIds = memberships.map((m) => m.challenge_id);

  const { data: logs } = await supabase
    .from("challenge_logs")
    .select("challenge_id, progress_value")
    .eq("user_id", userId)
    .in("challenge_id", challengeIds);

  return memberships.map((member) => {
    const challenge = member.challenges;

    const totalProgress = logs
      .filter((l) => l.challenge_id === challenge.id)
      .reduce((sum, l) => sum + l.progress_value, 0);

    const percentage = (totalProgress / challenge.target_value) * 100;

    return {
      id: challenge.id,
      title: challenge.title,
      targetValue: challenge.target_value,
      totalProgress,
      percentage: Math.min(100, Number(percentage.toFixed(2))),
    };
  });
};
