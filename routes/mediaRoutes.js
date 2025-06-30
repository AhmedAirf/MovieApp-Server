//"/api/movies"

const express = require("express");
const {
  getTrendingMovies,
  getMediaById,
  searchContent,
  getMediaVideos,
  getMediaCredits,
  getMediaImages,
  getMediaRecommendations,
  getPersonDetails,
  getPersonCredits,
  getPopularMedia,
  getTopRatedMedia,
  getGenres,
  getNowPlayingMovies,
  getUpcomingMovies,
  getAiringTodayTv,
  getOnTheAirTv,
  getAllMovies,
  getAllTvShowes,
} = require("../controllers/mediaController");
const router = express.Router();

// Get all movies OK
router.get("/movies", getAllMovies);

// Get all tv shows

router.get("/tv-shows", getAllTvShowes);

// Get all tv shows OK
router.get("/tv", getAllTvShowes);

//trending movies OK
router.get("/trending", getTrendingMovies);

// now playing movies OK
router.get("/movies/now-playing", getNowPlayingMovies);

// upcoming movies OK
router.get("/movies/upcoming", getUpcomingMovies);

// airing today tv shows\ OK
router.get("/airing-today/tv", getAiringTodayTv);

// on the air tv shows OK
router.get("/on-the-air/tv", getOnTheAirTv);

// Generes OK
router.get("/genres", getGenres);

// search content OK

router.get("/search", searchContent);

// get media by id OK
router.get("/:type/:id", getMediaById);

// get media videos (trailer , etc.) OK
router.get("/:type/:id/videos", getMediaVideos);

// get media credits (cast and crew) OK
router.get("/:type/:id/credits", getMediaCredits);

// get media images (posters, backdrops) OK
router.get("/:type/:id/images", getMediaImages);

// get media recommendations OK
router.get("/:type/:id/recommendations", getMediaRecommendations);

// popular media OK
router.get("/:type/popular", getPopularMedia);

// top rated media Next Err
router.get("/:type/top-rated", getTopRatedMedia);

// person details OK
router.get("/person/:id", getPersonDetails);

// person credits OK
router.get("/person/:id/credits", getPersonCredits);

module.exports = router;
