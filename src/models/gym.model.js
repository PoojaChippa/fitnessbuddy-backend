import axios from "axios";

/* =========================
   GET CITY COORDINATES
========================= */
const getCoordinates = async (city) => {
  const response = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: city,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "FitnessBuddy-App",
      },
    },
  );

  if (!response.data.length) {
    throw new Error("City not found");
  }

  return {
    lat: response.data[0].lat,
    lon: response.data[0].lon,
  };
};

/* =========================
   FIND NEARBY GYMS (5KM)
========================= */
export const findGymsByCity = async (city) => {
  const { lat, lon } = await getCoordinates(city);

  const overpassQuery = `
    [out:json];
    (
      node["leisure"="fitness_centre"](around:5000,${lat},${lon});
      way["leisure"="fitness_centre"](around:5000,${lat},${lon});
      relation["leisure"="fitness_centre"](around:5000,${lat},${lon});
    );
    out center;
  `;

  const response = await axios.post(
    "https://overpass-api.de/api/interpreter",
    overpassQuery,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    },
  );

  const gyms = response.data.elements
    .filter((place) => place.tags?.name)
    .map((place) => ({
      name: place.tags.name,
      latitude: place.lat || place.center?.lat,
      longitude: place.lon || place.center?.lon,
      address: place.tags?.["addr:street"] || "Address not available",
    }));

  return gyms.slice(0, 10); // limit to 10 results
};
