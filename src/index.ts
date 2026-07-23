// Import Express framework
import express from "express";
// Import users router
import userRouter from "./modules/users/users.router.js";
// import order router
import orderRouter from "./modules/orders/orders.router.js";
// Import auth router
import authRouter from "./modules/auth/auth.router.js";

import "dotenv/config";

// Create Express application instance
const app = express();

// Middleware
// Parse JSON request bodies-> Converts incoming JSON requests into JavaScript objects
app.use(express.json());

// Port number where server will run
const PORT = process.env.PORT || 3000;

// Root route-> When user visits http://localhost:3000
app.get("/", (_req, res) => {
  // Send response back to client
  res.send("API is running");
});

// User Routes->All routes in users.router.ts will start with /api/users
app.use("/api/users", userRouter);
// Order Routes
app.use("/api/orders", orderRouter);
//Auth  Routes
app.use("/api/auth", authRouter);

// Start Express servers
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
