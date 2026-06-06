const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ─── Helper: Generate JWT Token ───────────────────────────────────────────────
// We create this helper so we don't repeat the same jwt.sign() code
// in both signup and login controllers.
//
// jwt.sign(payload, secret, options)
//   payload  = data stored inside the token (we store user's ID)
//   secret   = our JWT_SECRET from .env (used to sign + verify)
//   expiresIn = token auto-expires after this duration (security best practice)
// ─────────────────────────────────────────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d", // token valid for 7 days
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public (anyone can hit this)
// ─────────────────────────────────────────────────────────────────────────────
const signup = async (req, res) => {
  try {
    // Step 1: Pull name, email, password from request body
    // The frontend sends: { name: "Manseerat", email: "...", password: "..." }
    const { name, email, password } = req.body;

    // Step 2: Basic validation — check all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Step 3: Check if email already exists in database
    // We do this BEFORE hashing to save computation time
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Step 4: Hash the password BEFORE storing
    // bcrypt.hash(plainPassword, saltRounds)
    // saltRounds = 10 means bcrypt runs the hashing algorithm 2^10 = 1024 times
    // This makes brute-force attacks very slow even if DB is stolen
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 5: Create the user in MongoDB
    // We store the hashedPassword, NOT the original password
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Step 6: Generate JWT token for the new user
    const token = generateToken(user._id);

    // Step 7: Send response (never send the password back, even hashed)
    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    // Mongoose validation errors (e.g., invalid email format, name too short)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    res.status(500).json({ message: "Server error during signup" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/auth/login
// @desc    Login existing user and return JWT
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter email and password" });
    }

    // Step 2: Find user by email in the database
    const user = await User.findOne({ email });

    // IMPORTANT: We give a generic error message "Invalid credentials"
    // NOT "Email not found" — we don't want to reveal which part was wrong
    // This prevents attackers from using signup to discover registered emails
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Step 3: Compare entered password with the stored hash
    // bcrypt.compare(plaintext, hash) → true or false
    // It's smart enough to extract the salt from the stored hash automatically
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Step 4: Generate JWT token
    const token = generateToken(user._id);

    // Step 5: Send token + user info back to frontend
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private (requires token)
//
// IMPORTANT CONCEPT: JWT logout works differently from session logout.
// The server doesn't store JWTs anywhere — so we can't "delete" the token.
// Logout is handled on the FRONTEND by deleting the token from localStorage.
// The backend just confirms the logout request was received.
//
// For production apps, you'd implement a token blacklist in Redis, but
// for a placement project this approach is standard and acceptable.
// ─────────────────────────────────────────────────────────────────────────────
const logout = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/auth/me
// @desc    Get currently logged-in user's data
// @access  Private (requires token)
//
// This is used when the page refreshes — the frontend sends the stored token
// and gets back the user data to restore the logged-in state.
// ─────────────────────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  // req.user is set by the protect middleware (auth.js)
  // It already has the user data from MongoDB
  res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
};

module.exports = { signup, login, logout, getMe };
