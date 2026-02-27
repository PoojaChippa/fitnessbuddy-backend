export const calculateBMI = (weight, height) => {
  const h = height / 100;
  return Number((weight / (h * h)).toFixed(2));
};

export const estimateDays = (currentWeight, targetWeight, avgCalories) => {
  const kg = currentWeight - targetWeight;
  const calories = kg * 7700;
  return Math.ceil(calories / avgCalories);
};
