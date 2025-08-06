//axios for tmdb api

const axios = require("axios");

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${TMDB_API_KEY}`,
    "Content-Type": "application/json",
  },
});
const fetchTrendingMovies = () => tmdbApi.get("/trending/movie/week");
const fetchMovieById = (id) => tmdbApi.get(`/movie/${id}`);
const fetchTvById = (id) => tmdbApi.get(`/tv/${id}`);
const searchMulti = (query) =>
  tmdbApi.get(`/search/multi?query=${encodeURIComponent(query)}`);
const fetchPersonById = (id) => tmdbApi.get(`/person/${id}`);
const fetchPersonCredits = (id) =>
  tmdbApi.get(`/person/${id}/combined_credits`);
const fetchMovieCredits = (id) => tmdbApi.get(`/movie/${id}/credits`);
const fetchTvCredits = (id) => tmdbApi.get(`/tv/${id}/credits`);
const fetchMovieRecommendations = (id) =>
  tmdbApi.get(`/movie/${id}/recommendations`);
const fetchTvRecommendations = (id) => tmdbApi.get(`/tv/${id}/recommendations`);
const fetchMovieVideos = (id) => tmdbApi.get(`/movie/${id}/videos`);
const fetchTvVideos = (id) => tmdbApi.get(`/tv/${id}/videos`);
const fetchMovieImages = (id) => tmdbApi.get(`/movie/${id}/images`);
const fetchTvImages = (id) => tmdbApi.get(`/tv/${id}/images`);
const fetchPopularMovies = () => tmdbApi.get(`/movie/popular`);
const fetchTopRatedMovies = () => tmdbApi.get(`/movie/top_rated`);
const fetchPopularTvShows = () => tmdbApi.get(`/tv/popular`);
const fetchTopRatedTvShows = () => tmdbApi.get(`/tv/top_rated`);
const fetchMovieGenres = () => tmdbApi.get("/genre/movie/list");
const fetchTvGenres = () => tmdbApi.get("/genre/tv/list");
const fetchNowPlayingMovies = () => tmdbApi.get("/movie/now_playing");
const fetchUpcomingMovies = () => tmdbApi.get("/movie/upcoming");
const fetchAiringTodayTv = () => tmdbApi.get("/tv/airing_today");
const fetchOnTheAirTv = () => tmdbApi.get("/tv/on_the_air");

module.exports = {
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
};
