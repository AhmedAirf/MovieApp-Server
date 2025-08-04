//"/api/user"

const express = require("express");
const {
  getAllUsers,
  getUserById,
  deleteUser,
  uptateUser,
  getProfile,
  uptadeProfile,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  clearWatchlist,
} = require("../controllers/userControllers");
const router = express.Router();
const { isAdmin } = require("../middleware/adminMiddleware");
const { protect } = require("../middleware/authMiddleware");

// Get user profile (Authenticated user)
router.get("/profile", protect, getProfile);
// Update user profile (Authenticated user)
router.put("/profile", protect, uptadeProfile);
// Get user watchlist (Authenticated user)
router.get("/watchlist", protect, getWatchlist);
// Add to watchlist (Authenticated user)
router.post("/watchlist", protect, addToWatchlist);
// Clear entire watchlist (Authenticated user)
router.delete("/watchlist", protect, clearWatchlist);
// Remove from watchlist (Authenticated user)
router.delete("/watchlist/:tmdbid", protect, removeFromWatchlist);
// Get all users (Admin only)
router.get("/", protect, isAdmin, getAllUsers);
// Get user by ID (Admin only)
router.get("/:id", protect, isAdmin, getUserById);
// Delete user by ID (Admin only)
router.delete("/:id", protect, isAdmin, deleteUser);
// Update user by ID (Admin only)
router.put("/:id", protect, isAdmin, uptateUser);

module.exports = router;
