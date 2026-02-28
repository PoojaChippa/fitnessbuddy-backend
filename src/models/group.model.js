import { supabase } from "../config/supabase.js";

/* CREATE GROUP */
export const createGroup = async ({
  name,
  goal_type,
  target_value,
  ownerId,
}) => {
  const { data, error } = await supabase
    .from("groups")
    .insert({
      name,
      goal_type,
      target_value,
      owner_id: ownerId,
    })
    .select()
    .single();

  if (error) throw error;

  // Add owner as first member
  await supabase.from("group_members").insert({
    group_id: data.id,
    user_id: ownerId,
  });

  return data;
};

/* JOIN GROUP */
export const joinGroup = async ({ groupId, userId }) => {
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select("id")
    .eq("id", groupId)
    .single();

  if (groupError || !group) {
    throw new Error("Group not found");
  }

  //  Prevent duplicate join
  const { data: existing } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    throw new Error("User already joined this group");
  }

  // Check group capacity (max 5)
  const { count, error: countError } = await supabase
    .from("group_members")
    .select("*", { count: "exact", head: true })
    .eq("group_id", groupId);

  if (countError) throw countError;

  if (count >= 5) {
    throw new Error("Group is full (max 5 members)");
  }

  //  Insert membership
  const { data, error } = await supabase
    .from("group_members")
    .insert({
      group_id: groupId,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};

/* LOG GROUP WORKOUT */
export const logGroupWorkout = async ({
  groupId,
  userId,
  type,
  duration,
  calories,
}) => {
  // Ensure user is member
  const { data: member } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!member) {
    throw new Error("User is not a member of this group");
  }

  const { data, error } = await supabase
    .from("group_workouts")
    .insert({
      group_id: groupId,
      user_id: userId,
      type,
      duration,
      calories,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};

/* GROUP PROGRESS */
export const getGroupProgress = async (groupId) => {
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select("*")
    .eq("id", groupId)
    .single();

  if (groupError || !group) throw new Error("Group not found");

  const { data: workouts = [], error } = await supabase
    .from("group_workouts")
    .select("duration, calories")
    .eq("group_id", groupId);

  if (error) throw error;

  const totalCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0);

  const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);

  const achievedValue =
    group.goal_type === "calories" ? totalCalories : totalDuration;

  const percentage =
    group.target_value > 0 ? (achievedValue / group.target_value) * 100 : 0;

  return {
    goalType: group.goal_type,
    targetValue: group.target_value,
    achievedValue,
    percentage: Math.min(100, Number(percentage.toFixed(2))),
    totalWorkouts: workouts.length,
  };
};

/* MY GROUPS */
export const getMyGroups = async (userId) => {
  const { data, error } = await supabase
    .from("group_members")
    .select("group_id, groups(*)")
    .eq("user_id", userId);

  if (error) throw error;

  return data.map((g) => g.groups);
};

/* GROUP DAILY STATS */
export const getGroupDailyStats = async (groupId) => {
  const { data = [], error } = await supabase
    .from("group_workouts")
    .select("created_at, calories")
    .eq("group_id", groupId);

  if (error) throw error;

  const daily = {};

  data.forEach((w) => {
    const date = w.created_at.split("T")[0];
    if (!daily[date]) daily[date] = 0;
    daily[date] += w.calories || 0;
  });

  return Object.entries(daily).map(([date, calories]) => ({
    date,
    calories,
  }));
};

/*  GROUP LEADERBOARD */
export const getGroupLeaderboard = async (groupId) => {
  const { data = [], error } = await supabase
    .from("group_workouts")
    .select("user_id, calories, duration")
    .eq("group_id", groupId);

  if (error) throw error;

  const leaderboardMap = {};

  data.forEach((entry) => {
    if (!leaderboardMap[entry.user_id]) {
      leaderboardMap[entry.user_id] = {
        userId: entry.user_id,
        totalCalories: 0,
        totalDuration: 0,
      };
    }

    leaderboardMap[entry.user_id].totalCalories += entry.calories || 0;
    leaderboardMap[entry.user_id].totalDuration += entry.duration || 0;
  });

  return Object.values(leaderboardMap)
    .sort((a, b) => b.totalCalories - a.totalCalories)
    .map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
};

export const deleteGroup = async ({ groupId, userId }) => {
  const { data, error } = await supabase
    .from("groups")
    .delete()
    .eq("id", groupId)
    .eq("owner_id", userId);

  if (error) {
    console.error("DELETE GROUP ERROR:", error);
    throw error;
  }

  return data;
};
