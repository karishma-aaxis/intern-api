// User Router -> Defines user API routes

// Import Router from Express
import { Router, type Router as ExpressRouter } from "express";

// Import user controller functions
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./users.controller.js";

// Import authentication middleware
import { authenticate } from "../../middleware/auth.js";

// Import role-based authorization middleware
import { requireRole } from "../../middleware/requireRole.js";

// Import owner or admin authorization middleware
import { requireOwnerOrAdmin } from "../../middleware/requireOwnerOrAdmin.js";

// Import request validation middleware
import { validate } from "../../middleware/validate.js";

// Import Zod schema for update validation
import { updateUserBodySchema } from "./users.schema.js";

// Import Role enum
import { Role } from "@prisma/client";

// Create a new router instance
const router: ExpressRouter = Router();

// GET /api/users -> Return all users (Admin only)
router.get("/", authenticate, requireRole(Role.ADMIN), getUsers);

// GET /api/users/:id -> Return a user by ID (Admin or the user)
router.get("/:id", authenticate, requireOwnerOrAdmin,getUserById);

// PATCH /api/users/:id -> Update a user (Admin or the user)
router.patch("/:id", authenticate,requireOwnerOrAdmin, validate(updateUserBodySchema), updateUser);

// DELETE /api/users/:id -> Delete a user (Admin only)
router.delete("/:id", authenticate, requireRole(Role.ADMIN), deleteUser);

// Export router
export default router;
