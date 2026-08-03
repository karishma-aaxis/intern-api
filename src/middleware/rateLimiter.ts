// Import Express rate limiting middleware
import { rateLimit } from "express-rate-limit";

// Limit repeated authentication requests to prevent brute-force attacks
export const authLimiter = rateLimit({
  // Time window for tracking requests (15 minutes)
  windowMs: 15 * 60 * 1000,

  // Maximum number of requests allowed per IP within the time window
  limit: 5,

  // Response returned when the rate limit is exceeded
  message: {
    error: "Too many authentication attempts. Please try again after 15 minutes.",
  },

  // Return standard RateLimit response headers
  standardHeaders: true,

  // Disable legacy X-RateLimit-* headers
  legacyHeaders: false,
});