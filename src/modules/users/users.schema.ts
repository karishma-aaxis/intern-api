// Import Zod validation library to create validation schemas.
import { z } from "zod";

// Validate the user ID from route parameters
export const getUserByIdSchema = z.object({
  id: z.string().min(1, "User id is required"), // User ID must be a non-empty string
});

// Validate the user ID for update requests
export const updateUserParamsSchema = z.object({
  id: z.string().min(1, "User id is required"), // User ID must be a non-empty string
});

// Validate the request body for updating a user
export const updateUserBodySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(), // Name must be at least 2 characters (optional)
  email: z.string().email("Invalid email address").optional(), // Email must be valid (optional)
});

// Validate the user ID for delete requests
export const deleteUserSchema = z.object({
  id: z.string().min(1, "User id is required"), // User ID must be a non-empty string
});

