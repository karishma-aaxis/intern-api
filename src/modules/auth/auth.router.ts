// Import Router function from Express
import { Router, type Router as ExpressRouter } from "express";
// Import auth controllers
import { signup, login } from "./auth.controller.js";
//Import validate middleware
import { validate } from "../../middleware/validate.js";

// Import zod schemas
import { signupSchema, loginSchema } from "./auth.schema.js";

//Create router instance
const router: ExpressRouter = Router();

// POST /api/auth/signup -> Register a new user
router.post("/signup", validate(signupSchema), signup);

// POST /api/auth/login -> Login user and generate JWTs
router.post("/login", validate(loginSchema), login);

//export router
export default router;
