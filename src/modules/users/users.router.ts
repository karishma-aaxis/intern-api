// Router File->Defines API endpoints

// Import Router function from Express-> Router is used to create route groups
// Import ExpressRouter type for TypeScript->This gives type safety to our router variable
import { Router, type Router as ExpressRouter } from "express";

// Import controller function that handles GET /api/users
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./users.controller.js";
//Import authentciation middleware
import { authenticate } from "../../middleware/auth.js";
//Import role-based authorization middlware
import { requireRole } from "../../middleware/requireRole.js";
//Import Role enum from Prisma
import { Role } from "@prisma/client";

import { validate } from "../../middleware/validate.js";
import { updateUserBodySchema } from "./users.schema.js";

// Create a new router instance
// TypeScript knows this variable is an Express Router
const router: ExpressRouter = Router();

// GET /api/users->Returns all users (Admin only)
// When a client sends a GET request to /api/users, execute the getUsers controller
router.get("/", authenticate, requireRole(Role.ADMIN), getUsers);

// GET /api/users/:id->Returns a single user by id (Admin or the user themselves)
router.get("/:id", authenticate, getUserById);

// PATCH /api/users/:id-> Update a user's name or email(Admin or the user themselves)
// (Partial Update)
router.patch("/:id", authenticate, validate(updateUserBodySchema), updateUser);

// DELETE /api/users/:id-> Deletes a user by id (Admin only)
router.delete("/:id", authenticate, requireRole(Role.ADMIN), deleteUser);


export default router;
// Export router so it can be used in index.ts
