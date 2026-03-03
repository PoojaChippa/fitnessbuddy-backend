/* utils/bmi.js */

export const calculateBMI = (weight, heightCm) => {
  if (!weight || !heightCm) return null;
  const heightM = heightCm / 100;
  return Number((weight / (heightM * heightM)).toFixed(2));
};

export const calculateWeightLossFromCalories = (totalCalories) => {
  return totalCalories / 7700; // 7700 kcal = 1kg fat
};

export const calculateTargetWeight = (targetBMI, heightCm) => {
  if (!targetBMI || !heightCm) return null;
  const heightM = heightCm / 100;
  return Number((targetBMI * (heightM * heightM)).toFixed(2));
};

export const calculateEstimatedDays = (caloriesNeeded, avgDailyBurn) => {
  if (!avgDailyBurn || avgDailyBurn <= 0) return null;
  return Math.ceil(caloriesNeeded / avgDailyBurn);
};
