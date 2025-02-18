import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDB_URL = "http://www.omdbapi.com/";

router.get("/random", async (req, res) => {
  try {
    console.log("/random data is success!");
    console.log("API-key OMDb:", OMDB_API_KEY);

    const currentYear = new Date().getFullYear();
    const randomYear =
      Math.floor(Math.random() * (currentYear - 1990 + 1)) + 1990;

    console.log(`Films for ${randomYear} year`);

    const response = await axios.get(OMDB_URL, {
      params: {
        apikey: OMDB_API_KEY,
        s: "movie",
        type: "movie",
        y: randomYear,
        page: 1,
      },
    });

    console.log("Status OMDb:", response.status);
    console.log("Data OMDb:", JSON.stringify(response.data, null, 2));

    if (response.data.Response === "True" && response.data.Search) {
      const movies = response.data.Search;
      const randomMovies = movies.sort(() => 0.5 - Math.random()).slice(0, 8);

      res.json(randomMovies);
    } else {
      console.log("OMDb return error", response.data);
      res
        .status(404)
        .json({ error: "Film not found", omdbResponse: response.data });
    }
  } catch (error) {
    console.error("Error while querying OMDb:");
    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error("Response headers:", error.response.headers);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error(
        "The request was made, but no response was received",
        error.request
      );
    } else {
      console.error("Error while setting up request", error.message);
    }
    console.error("Request configuration:", error.config);

    res.status(500).json({
      error: "Error retrieving data from OMDb",
      details: error.message,
    });
  }
});

export default router;
