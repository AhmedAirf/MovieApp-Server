//profile/admin/watchlist
const User = require("../models/user");
const { fetchMovieById, fetchTvById } = require("../utils/tmdb");

// Admin Opreationes(Get all users, Get user by ID  , Delete user , update user)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password"); // Exclude password from the response
    return res.status(200).json({
      status: 200,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId).select(
      "-password"
    ); // Exclude password from the response
    if (!deletedUser) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.uptateUser = async (req, res, next) => {
  const userId = req.params.id;
  const uptadedData = { ...req.body };
  try {
    const uptatedUser = await User.findByIdAndUpdate(userId, uptadedData, {
      new: true,
    }).select("-password");
    if (!uptatedUser) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "User updated successfully",
      data: uptatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// User Operations (Get user profile, Update user profile)

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found.",
      });
    }

    res.status(200).json({
      status: 200,
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.uptadeProfile = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found.",
      });
    }
    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    return res.status(200).json({
      status: 200,
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// watchlist operations
exports.getWatchlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found.",
      });
    }

    // If watchlist is empty, return empty array
    if (!user.watchlist || user.watchlist.length === 0) {
      return res.status(200).json({
        status: 200,
        watchlist: [],
      });
    }

    const detailedWatchlist = await Promise.all(
      user.watchlist.map(async (item) => {
        console.log("Processing watchlist item:", item);
        try {
          if (item.media_type === "movie") {
            const response = await fetchMovieById(item.tmdbid);
            const result = {
              ...response.data,
              media_type: "movie", // Ensure media_type is preserved
            };
            console.log("Fetched movie data:", {
              id: result.id,
              title: result.title,
              media_type: result.media_type,
            });
            return result;
          } else if (item.media_type === "tv") {
            const response = await fetchTvById(item.tmdbid);
            const result = {
              ...response.data,
              media_type: "tv", // Ensure media_type is preserved
            };
            console.log("Fetched TV data:", {
              id: result.id,
              name: result.name,
              media_type: result.media_type,
            });
            return result;
          } else {
            console.error(
              `Unknown media_type: ${item.media_type} for ID ${item.tmdbid}`
            );
            return {
              id: item.tmdbid,
              media_type: item.media_type,
              title: `Unknown ${item.media_type}`,
              name: `Unknown ${item.media_type}`,
              poster_path: null,
              overview: "Content not available",
              release_date: null,
              first_air_date: null,
              vote_average: 0,
            };
          }
        } catch (error) {
          console.error(
            `Error fetching ${item.media_type} with ID ${item.tmdbid}:`,
            error.message
          );
          // Return a placeholder object if TMDB API fails
          return {
            id: item.tmdbid,
            media_type: item.media_type,
            title: `Unknown ${item.media_type}`,
            name: `Unknown ${item.media_type}`,
            poster_path: null,
            overview: "Content not available",
            release_date: null,
            first_air_date: null,
            vote_average: 0,
          };
        }
      })
    );

    res.status(200).json({
      status: 200,
      watchlist: detailedWatchlist,
    });
  } catch (error) {
    console.error("Error in getWatchlist:", error);
    next(error);
  }
};

exports.addToWatchlist = async (req, res, next) => {
  try {
    console.log("addToWatchlist called with body:", req.body);
    const { tmdbid, media_type } = req.body;

    if (!tmdbid || !media_type) {
      console.log("Missing required fields:", { tmdbid, media_type });
      return res.status(400).json({
        status: 400,
        message: "Please provide both tmdbid and media_type.",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found.",
      });
    }

    // Ensure tmdbid is stored as string for consistency
    const tmdbidString = String(tmdbid);

    const exists = user.watchlist.some(
      (item) =>
        String(item.tmdbid) === tmdbidString && item.media_type === media_type
    );

    if (exists) {
      return res.status(409).json({
        status: 409,
        message: "Item already exists in watchlist.",
      });
    }

    user.watchlist.push({ tmdbid: tmdbidString, media_type });
    await user.save();

    return res.status(201).json({
      status: 201,
      message: "Item added to watchlist successfully.",
      watchlist: user.watchlist,
    });
  } catch (error) {
    next(error);
  }
};
exports.removeFromWatchlist = async (req, res, next) => {
  try {
    const { tmdbid, media_type } = req.params;

    console.log("removeFromWatchlist called with:", { tmdbid, media_type });

    if (!tmdbid) {
      return res
        .status(400)
        .json({ status: 400, message: "tmdbid is required." });
    }

    if (!media_type) {
      return res
        .status(400)
        .json({ status: 400, message: "media_type is required." });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found." });
    }

    const tmdbidString = String(tmdbid);
    const mediaTypeLower = media_type.toLowerCase();

    console.log("Looking for item:", { tmdbidString, mediaTypeLower });
    console.log("Current watchlist:", user.watchlist);

    // Validate media_type
    if (!["movie", "tv"].includes(mediaTypeLower)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid media_type. Must be 'movie' or 'tv'.",
      });
    }

    // Check if item exists - be more specific about matching
    const found = user.watchlist.some(
      (item) =>
        String(item.tmdbid) === tmdbidString &&
        item.media_type.toLowerCase() === mediaTypeLower
    );

    console.log("Item found:", found);

    if (!found) {
      return res.status(404).json({
        status: 404,
        message: `Item with tmdbid ${tmdbid} and media_type ${media_type} not found in watchlist.`,
      });
    }

    // Remove it - be more specific about matching
    user.watchlist = user.watchlist.filter(
      (item) =>
        !(
          String(item.tmdbid) === tmdbidString &&
          item.media_type.toLowerCase() === mediaTypeLower
        )
    );

    console.log("Watchlist after removal:", user.watchlist);

    await user.save();

    return res.status(200).json({
      status: 200,
      message: "Item removed from watchlist successfully.",
      watchlist: user.watchlist,
    });
  } catch (error) {
    console.error("Error in removeFromWatchlist:", error);
    next(error);
  }
};

exports.clearWatchlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found.",
      });
    }

    user.watchlist = [];
    await user.save();

    return res.status(200).json({
      status: 200,
      message: "Watchlist cleared successfully.",
      watchlist: [],
    });
  } catch (error) {
    next(error);
  }
};
