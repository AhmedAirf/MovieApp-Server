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
        try {
          if (item.media_type === "movie") {
            const response = await fetchMovieById(item.tmdbid);
            // Ensure the id field matches the tmdbid stored in database
            return { ...response.data, id: item.tmdbid };
          } else {
            const response = await fetchTvById(item.tmdbid);
            // Ensure the id field matches the tmdbid stored in database
            return { ...response.data, id: item.tmdbid };
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

    const exists = user.watchlist.some(
      (item) =>
        String(item.tmdbid) === String(tmdbid) && item.media_type === media_type
    );

    if (exists) {
      return res.status(409).json({
        status: 409,
        message: "Item already exists in watchlist.",
      });
    }

    user.watchlist.push({ tmdbid, media_type });
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
  const { tmdbid } = req.params;
  const { media_type } = req.query;

  console.log("removeFromWatchlist called with:", { tmdbid, media_type });

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({
        status: 404,
        message: "User not found.",
      });
    }

    console.log("User found, current watchlist:", user.watchlist);

    // Filter by both tmdbid and media_type if provided
    // Convert tmdbid to string for comparison to handle both string and number types
    const updatedWatchlist = user.watchlist.filter(
      (item) =>
        !(
          String(item.tmdbid) === String(tmdbid) &&
          (!media_type || item.media_type === media_type)
        )
    );

    console.log("Updated watchlist after filtering:", updatedWatchlist);
    console.log(
      "Original length:",
      user.watchlist.length,
      "New length:",
      updatedWatchlist.length
    );

    if (updatedWatchlist.length === user.watchlist.length) {
      console.log("Item not found in watchlist");
      return res.status(404).json({
        status: 404,
        message: "Item not found in watchlist.",
      });
    }

    user.watchlist = updatedWatchlist;
    await user.save();

    console.log("Item removed successfully");

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
