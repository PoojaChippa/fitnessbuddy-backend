import * as gymModel from "../models/gym.model.js";
import { successResponse } from "../utils/apiResponse.js";

export const getNearbyGyms = async (req, res, next) => {
  try {
    const { city } = req.query;

    if (!city || city.trim() === "") {
      const error = new Error("City is required");
      error.statusCode = 400;
      throw error;
    }

    const gyms = await gymModel.findGymsByCity(city.trim());

    return successResponse(res, {
      count: gyms.length,
      gyms,
    });
  } catch (err) {
    next(err);
  }
};
