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

    const detailedWatchlist = await Promise.all(
      user.watchlist.map(async (item) => {
        if (item.media_type === "movie") {
          const response = await fetchMovieById(item.tmdbid);
          return response.data;
        } else {
          const response = await fetchTvById(item.tmdbid);
          return response.data;
        }
      })
    );

    res.status(200).json({
      status: 200,
      watchlist: detailedWatchlist,
    });
  } catch (error) {
    next(error);
  }
};

exports.addToWatchlist = async (req, res, next) => {
  try {
    const { tmdbid, media_type } = req.body;

    if (!tmdbid || !media_type) {
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
      (item) => item.tmdbid === tmdbid && item.media_type === media_type
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
  try {
    const user = await User.findById(req.user._id);
    const uptadedWatchlist = user.watchlist.filter(
      (item) => item.tmdbid !== tmdbid
    );

    if (uptadedWatchlist.length === user.watchlist.length) {
      return res.status(404).json({
        status: 404,
        message: "Item not found in watchlist.",
      });
    }
    user.watchlist = uptadedWatchlist;
    await user.save();
    return res.status(200).json({
      status: 200,
      message: "Item removed from watchlist successfully.",
      watchlist: user.watchlist,
    });
  } catch (error) {
    next(error);
  }
};
