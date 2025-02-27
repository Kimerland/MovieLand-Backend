import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const OMDB_URL = "http://www.omdbapi.com/";

// for id
router.get("/info/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(OMDB_URL, {
      params: { apikey: OMDB_API_KEY, i: id },
    });

    if (response.data.Response === "True") {
      res.json(response.data);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch (error) {
    console.error("Error film", error.message);
    res.status(500).json({ error: "Error server" });
  }
});

// trailer
router.get("/trailer", async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) return res.status(400).json({ error: "Name no found" });

    const response = await axios.get(YOUTUBE_SEARCH_URL, {
      params: {
        key: YOUTUBE_API_KEY,
        q: `${title} official trailer`,
        part: "snippet",
        maxResults: 1,
        type: "video",
      },
    });

    const videos = response.data.items;
    if (videos.length > 0) {
      res.json({ videoId: videos[0].id.videoId });
    } else {
      res.status(404).json({ error: "Trailer not found!" });
    }
  } catch (error) {
    console.error("Trailer receipt error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

//  random
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

      const detailedMovies = await Promise.all(
        randomMovies.map(async (movie) => {
          const detailsResponse = await axios.get(OMDB_URL, {
            params: { apikey: OMDB_API_KEY, i: movie.imdbID },
          });

          return detailsResponse.data.Response === "True"
            ? detailsResponse.data
            : null;
        })
      );

      res.json(detailedMovies.filter((movie) => movie !== null));
    } else {
      console.log("OMDb return error", response.data);
      res
        .status(404)
        .json({ error: "Film not found", omdbResponse: response.data });
    }
  } catch (error) {
    console.error("Error while querying OMDb:", error.message);
    res.status(500).json({
      error: "Error retrieving data from OMDb",
      details: error.message,
    });
  }
});

export default router;

// all films pagination

router.get("/", async (req, res) => {
  try {
    const { year, page = 1 } = req.query;

    if (!year) return res.status(400).json({ error: "Year is required" });

    console.log(`A request for movies for ${year} year, page ${page}`);

    const response = await axios.get(OMDB_URL, {
      params: {
        apikey: OMDB_API_KEY,
        s: "movie",
        type: "movie",
        y: year,
        page: page,
      },
    });

    if (response.data.Response !== "True" || !response.data.Search) {
      return res
        .status(404)
        .json({ error: "Film not found", response: response.data });
    }

    const movies = await Promise.all(
      response.data.Search.map(async (movie) => {
        const detailsResponse = await axios.get(OMDB_URL, {
          params: {
            apikey: OMDB_API_KEY,
            i: movie.imdbID,
          },
        });

        return detailsResponse.data; 
      })
    );

    res.json(movies); 
  } catch (error) {
    console.error("Error when requesting movies:", error.message);
    res.status(500).json({ error: "Error server", details: error.message });
  }
});
