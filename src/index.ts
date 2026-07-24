// Import Express framework
import express from "express";

// Load environment variables
import "dotenv/config";

// Import module routers
import userRouter from "./modules/users/users.router.js";
import orderRouter from "./modules/orders/orders.router.js";
import authRouter from "./modules/auth/auth.router.js";

// Create Express application
const app = express();

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
