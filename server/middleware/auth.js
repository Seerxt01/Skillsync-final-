const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ─── What is middleware? ──────────────────────────────────────────────────────
// Middleware runs BETWEEN the request arriving and your route handler running.
// This specific middleware is a "gatekeeper" — it checks if the user is logged in
// before allowing them to access protected routes like /api/user/dashboard.
//
// Flow:  Request → authMiddleware (check JWT) → Route Handler (if valid)
//                                             → 401 Error (if invalid/missing)
// ─────────────────────────────────────────────────────────────────────────────

const protect = async (req, res, next) => {
  let token;

  // Step 1: Check if Authorization header exists and starts with "Bearer"
  // The frontend sends: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Step 2: Extract the token (remove "Bearer " prefix)
      // "Bearer eyJhbGciOiJIUzI1NiIs..." → "eyJhbGciOiJIUzI1NiIs..."
      token = req.headers.authorization.split(" ")[1];

      // Step 3: Verify the token using our secret key
      // jwt.verify() decodes the token AND checks it hasn't been tampered with
      // If the token is expired or fake, this throws an error → caught below
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Step 4: Find the user from the ID stored inside the token
      // .select("-password") means: get everything EXCEPT the password field
      // We never want to accidentally expose the hashed password
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Step 5: Call next() to pass control to the actual route handler
      // Without next(), the request would hang forever
      next();
    } catch (error) {
      // Token is expired, invalid, or tampered with
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
