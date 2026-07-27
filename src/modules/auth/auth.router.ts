// Import Router from Express
import { Router, type Router as ExpressRouter } from "express";

// Import authentication controller functions
import { signup, login } from "./auth.controller.js";

// Import validation middleware
import { validate } from "../../middleware/validate.js";

// Import Zod validation schemas
import { signupSchema, loginSchema } from "./auth.schema.js";

// Create a router instance
const router: ExpressRouter = Router();

// POST /api/auth/signup
// Validate request body, then register a new users
router.post("/signup", validate(signupSchema), signup);

// POST /api/auth/login
// Validate request body, then authenticate the user and generate a JWT
router.post("/login", validate(loginSchema), login);

// Export the router
export default router;
