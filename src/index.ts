// Import Express framework
import express from "express";

// Import CORS middleware
import cors from "cors";

// Load environment variables
import { env } from "./config/env.js";

// Import module routers
import userRouter from "./modules/users/users.router.js";
import orderRouter from "./modules/orders/orders.router.js";
import authRouter from "./modules/auth/auth.router.js";

// Import global middleware
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

import helmet from "helmet";

// Import authentication rate limiter
import { authLimiter } from "./middleware/rateLimiter.js";

// Create Express application
const app = express();

// Enable security headers
app.use(helmet());

// Allow requests only from the trusted frontend origin
app.use(
  cors({
    origin: "http://localhost:5173", // React development server (replace with production frontend URL after deployment)
    // credentials: true, // Enable when using cookie-based authentication
  })
);
// Parse incoming JSON request bodies and limit payload size to 10 KB
app.use(express.json({
      limit: "10kb",
}));

// Server port
const PORT = env.PORT;

// Root route
app.get("/", (_req, res) => {
  res.send("API is running");
});

// Register application routes
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/auth", authLimiter,authRouter);  // Apply rate limiting only to authentication routes

// Handle unknown routes(404)
app.use(notFound);

// Handle application errors
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
