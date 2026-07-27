// Import Express framework
import express from "express";

// Import CORS middleware
import cors from "cors";

// Load environment variables
import "dotenv/config";

// Import module routers
import userRouter from "./modules/users/users.router.js";
import orderRouter from "./modules/orders/orders.router.js";
import authRouter from "./modules/auth/auth.router.js";

// Import global middleware
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

// Create Express application
const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Server port
const PORT = process.env.PORT || 3000;

// Root route
app.get("/", (_req, res) => {
  res.send("API is running");
});

// Register application routes
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/auth", authRouter);

// Handle unknown routes(404)
app.use(notFound);

// Handle application errors
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
