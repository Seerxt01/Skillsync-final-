const express = require("express");
const router = express.Router();
const { signup, login, logout, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// ─── What is a Router? ───────────────────────────────────────────────────────
// express.Router() creates a mini Express app just for these routes.
// In server.js we'll mount this at "/api/auth" so:
//   router.post("/signup") → full URL is POST /api/auth/signup
//   router.post("/login")  → full URL is POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────

// Public routes — no token needed
router.post("/signup", signup);   // Create new account
router.post("/login", login);     // Login and get token

// Private routes — protect middleware runs first, checks JWT
// If JWT is valid → getMe / logout runs
// If JWT is missing/invalid → 401 error, route handler never runs
router.post("/logout", protect, logout);  // Logout (clears on frontend)
router.get("/me", protect, getMe);        // Get current user data (used on refresh)

module.exports = router;
