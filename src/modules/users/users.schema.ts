//We import zod valildiation library
import { z } from "zod"; // security guard that checks whether incoming data is valid

// Schema to validate the user id from URL parameters
export const getUserByIdSchema = z.object({
  // id must be a non-empty string
  id: z.string().min(1, "User id is required"),
});

// Schema to Validate user id from route parameter
export const updateUserParamsSchema = z.object({
  // User id must be a non-empty string
  id: z.string().min(1, "User id is required"),
});

//Sechma to Validate request body for updating a user
export const updateUserBodySchema = z.object({
  // user nmae  must be at least 2 charcters
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  // Email must be in a valid format
  email: z.string().email("Invalid email address").optional(),
});

// Schema to Validate user id from route parameter
export const deleteUserSchema = z.object({
  id: z.string().min(1, "user id is required"),
});

// Schema to  Validate request body for creating a new user
export const createUserSchema = z.object({
  // User name must be at least 2 characters
  name: z.string().min(2, "Name must  be at least 2 characters"),
  // Email must be in a valid format
  email: z.string().email("Invlaid email address"),

  // Password must be at least 8 characters
  password: z.string().min(8, "Password must be at least 8 characters"),
});
