const BASE_URL = "https://api.openweathermap.org";

const buildUrl = (type, params) => {
  switch (type) {
    case "current":
      return `${BASE_URL}/data/2.5/weather?lat=${params.lat}&lon=${params.lon}&units=metric`;
    case "forecast":
      return `${BASE_URL}/data/2.5/forecast?lat=${params.lat}&lon=${params.lon}&units=metric`;
    case "air":
      return `${BASE_URL}/data/2.5/air_pollution?lat=${params.lat}&lon=${params.lon}`;
    case "reverse":
      return `${BASE_URL}/geo/1.0/reverse?lat=${params.lat}&lon=${params.lon}&limit=5`;
    case "geo":
      return `${BASE_URL}/geo/1.0/direct?q=${params.query}&limit=5`;
    default:
      return null;
  }
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { type, lat, lon, query } = req.query;

  const API_KEY = process.env.OPENWEATHER_API_KEY;

  const url = buildUrl(type, { lat, lon, query });

  if (!url) {
    return res.status(400).json({ error: "Invalid type" });
  }

  try {
    const response = await fetch(`${url}&appid=${API_KEY}`);
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: "OpenWeather API error",
        details: errorText,
      });
    }

    const data = await response.json();

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch weather data" });
  }
}
