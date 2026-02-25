import { gyms } from "../utils/gyms.js";

export const findGyms = async (req, res) => {
  const { city, postal } = req.query;

  const results = gyms.filter((g) => g.city === city || g.postal === postal);

  res.json(results);
};
