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
   GET ALL CHALLENGES
========================= */
export const getAllChallenges = async () => {
  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
};
/* =========================
   JOIN CHALLENGE
========================= */
export const joinChallenge = async ({ challengeId, userId }) => {
  const { data: existing } = await supabase
    .from("challenge_members")
    .select("*")
    .eq("challenge_id", challengeId)
    .eq("user_id", userId)
    .single();

  if (existing) return existing;

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
    .select("challenge_id")
    .eq("user_id", userId);

  if (error) throw error;

  if (!memberships.length) return [];

  const challengeIds = memberships.map((m) => m.challenge_id);

  const { data: challenges, error: cError } = await supabase
    .from("challenges")
    .select("*")
    .in("id", challengeIds);

  if (cError) throw cError;

  const { data: logs, error: lError } = await supabase
    .from("challenge_logs")
    .select("challenge_id, progress_value")
    .eq("user_id", userId);

  if (lError) throw lError;

  return challenges.map((challenge) => {
    const totalProgress = logs
      .filter((l) => l.challenge_id === challenge.id)
      .reduce((sum, l) => sum + l.progress_value, 0);

    return {
      ...challenge,
      totalProgress,
    };
  });
};

/* =========================
   CHALLENGE LEADERBOARD
========================= */
export const getChallengeLeaderboard = async (challengeId) => {
  const { data, error } = await supabase
    .from("challenge_logs")
    .select(
      `
      user_id,
      progress_value,
      users(name)
    `,
    )
    .eq("challenge_id", challengeId);

  if (error) throw error;

  const leaderboard = {};

  data.forEach((row) => {
    if (!leaderboard[row.user_id]) {
      leaderboard[row.user_id] = {
        user: row.users?.name || "User",
        total: 0,
      };
    }

    leaderboard[row.user_id].total += row.progress_value;
  });

  return Object.values(leaderboard)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
};
/* =========================
   EXIT CHALLENGE
========================= */

export const exitChallenge = async ({ challengeId, userId }) => {
  const { error } = await supabase
    .from("challenge_members")
    .delete()
    .eq("challenge_id", challengeId)
    .eq("user_id", userId);

  if (error) throw error;

  return { success: true };
};

/* =========================
   DELETE CHALLENGE
========================= */

export const deleteChallenge = async (challengeId, userId) => {
  const { data: challenge, error: fetchError } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", challengeId)
    .single();

  if (fetchError) throw fetchError;

  if (challenge.owner_id !== userId) {
    throw new Error("Not authorized");
  }

  const { error } = await supabase
    .from("challenges")
    .delete()
    .eq("id", challengeId);

  if (error) throw error;

  return { success: true };
};
