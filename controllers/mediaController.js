//"popular/search/details /recommendations"
const {
  tmdbApi,
  fetchTrendingMovies,
  fetchMovieById,
  fetchTvById,
  searchMulti,
  fetchPersonById,
  fetchPersonCredits,
  fetchMovieCredits,
  fetchTvCredits,
  fetchMovieRecommendations,
  fetchTvRecommendations,
  fetchMovieVideos,
  fetchTvVideos,
  fetchMovieImages,
  fetchTvImages,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchPopularTvShows,
  fetchTopRatedTvShows,
  fetchMovieGenres,
  fetchTvGenres,
  fetchNowPlayingMovies,
  fetchUpcomingMovies,
  fetchAiringTodayTv,
  fetchOnTheAirTv,
} = require("../utils/tmdb");

// Get MOvie Homepage
// GET /api/movies

exports.getAllMovies = async (req, res, next) => {
  try {
    const [
      popularMovies,
      topRatedMovies,
      nowPlayingMovies,
      upcomingMovies,
      trendingMovies,
    ] = await Promise.allSettled([
      fetchPopularMovies(),
      fetchTopRatedMovies(),
      fetchNowPlayingMovies(),
      fetchUpcomingMovies(),
      fetchTrendingMovies(),
    ]);

    res.status(200).json({
      status: 200,
      message: "Movie homepage data fetched successfully",
      data: {
        popularMovies:
          popularMovies.status === "fulfilled"
            ? popularMovies.value.data.results
            : [],
        topRatedMovies:
          topRatedMovies.status === "fulfilled"
            ? topRatedMovies.value.data.results
            : [],
        nowPlayingMovies:
          nowPlayingMovies.status === "fulfilled"
            ? nowPlayingMovies.value.data.results
            : [],
        upcomingMovies:
          upcomingMovies.status === "fulfilled"
            ? upcomingMovies.value.data.results
            : [],
        trendingMovies:
          trendingMovies.status === "fulfilled"
            ? trendingMovies.value.data.results
            : [],
      },
    });
  } catch (error) {
    console.error("Error fetching movie homepage data:", error.message);
    next(error);
  }
};

//Get all TvShowes
// GET /api//tv-shows
exports.getAllTvShowes = async (req, res, next) => {
  try {
    const [
      popularTvShows,
      topRatedTvShows,
      airingTodayTv,
      onTheAirTv,
      trendingTvShows,
    ] = await Promise.allSettled([
      fetchPopularTvShows(),
      fetchTopRatedTvShows(),
      fetchAiringTodayTv(),
      fetchOnTheAirTv(),
    ]);

    res.status(200).json({
      status: 200,
      message: "TV shows data fetched successfully",
      data: {
        popularTvShows:
          popularTvShows.status === "fulfilled"
            ? popularTvShows.value.data.results
            : [],
        topRatedTvShows:
          topRatedTvShows.status === "fulfilled"
            ? topRatedTvShows.value.data.results
            : [],
        airingTodayTv:
          airingTodayTv.status === "fulfilled"
            ? airingTodayTv.value.data.results
            : [],
        onTheAirTv:
          onTheAirTv.status === "fulfilled"
            ? onTheAirTv.value.data.results
            : [],
      },
    });
  } catch (error) {
    console.error("Error fetching TV shows:", error.message);
    next(error);
  }
};

// Get trending movies
// GET /api/movies/trending
exports.getTrendingMovies = async (req, res, next) => {
  try {
    const response = await fetchTrendingMovies();
    res.status(200).json({
      status: 200,
      message: "Trending movies fetched successfully",
      data: response.data.results,
    });
  } catch (error) {
    next(error);
  }
};

// Get movie by ID
// GET /api/movies/:id

exports.getMediaById = async (req, res, next) => {
  const { id, type } = req.params;
  try {
    const response =
      type == "movie" ? await fetchMovieById(id) : await fetchTvById(id);
    res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
};
// Search for movies, TV shows, and people
// GET /api/search?query=searchTerm
exports.searchContent = async (req, res, next) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({
      status: 400,
      message: "Query parameter is required",
    });
  }
  try {
    const response = await searchMulti(query);
    res.status(200).json({
      status: 200,

      message: "Search results fetched successfully",
      data: response.data.results,
    });
  } catch (error) {
    next(error);
  }
};

// GET Videos (trailers, teasers)

exports.getMediaVideos = async (req, res, next) => {
  const { id, type } = req.params;
  try {
    const response =
      type === "movie" ? await fetchMovieVideos(id) : await fetchTvVideos(id);
    res.status(200).json(response.data.results);
  } catch (error) {
    next(error);
  }
};

// Cast and crew
exports.getMediaCredits = async (req, res, next) => {
  const { id, type } = req.params;
  try {
    const response =
      type === "tv" ? await fetchTvCredits(id) : await fetchMovieCredits(id);
    res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
};

// Posters & backdrops
exports.getMediaImages = async (req, res, next) => {
  const { id, type } = req.params;
  try {
    const response =
      type === "tv" ? await fetchTvImages(id) : await fetchMovieImages(id);
    res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
};
// Recommendations
exports.getMediaRecommendations = async (req, res, next) => {
  const { id, type } = req.params;
  try {
    const response =
      type === "tv"
        ? await fetchTvRecommendations(id)
        : await fetchMovieRecommendations(id);
    res.status(200).json(response.data.results);
  } catch (error) {
    next(error);
  }
};

// Person details
exports.getPersonDetails = async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await fetchPersonById(id);
    res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
};

// Person's credits
exports.getPersonCredits = async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await fetchPersonCredits(id);
    res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
};

// Get popular media
exports.getPopularMedia = async (req, res, next) => {
  const { type } = req.params;
  try {
    const response =
      type === "movie"
        ? await fetchPopularMovies()
        : await fetchPopularTvShows();
    res.status(200).json(response.data.results);
  } catch (error) {
    next(error);
  }
};

// Get top-rated media
exports.getTopRatedMedia = async (req, res, next) => {
  const { type } = req.params;
  try {
    const response =
      type === "movie"
        ? await fetchTopRatedMovies()
        : await fetchTopRatedTvShows();
    res.status(200).json(response.data.results);
  } catch (error) {
    next(error);
  }
};

// Get genres
exports.getGenres = async (req, res, next) => {
  const { type } = req.params;
  try {
    const response =
      type === "movie" ? await fetchMovieGenres() : await fetchTvGenres();
    res.status(200).json(response.data.genres);
  } catch (error) {
    next(error);
  }
};

// Get now playing movies
exports.getNowPlayingMovies = async (req, res, next) => {
  try {
    const response = await fetchNowPlayingMovies();
    res.status(200).json(response.data.results);
  } catch (error) {
    next(error);
  }
};

// Get upcoming movies
exports.getUpcomingMovies = async (req, res, next) => {
  try {
    const response = await fetchUpcomingMovies();
    res.status(200).json(response.data.results);
  } catch (error) {
    next(error);
  }
};

// Get airing today TV shows
exports.getAiringTodayTv = async (req, res, next) => {
  try {
    const response = await fetchAiringTodayTv();
    res.status(200).json(response.data.results);
  } catch (error) {
    console.error("Error calling TMDb:", error.message);

    next(error);
  }
};

// Get on the air TV shows
exports.getOnTheAirTv = async (req, res, next) => {
  try {
    const response = await fetchOnTheAirTv();
    res.status(200).json(response.data.results);
  } catch (error) {
    next(error);
  }
};
