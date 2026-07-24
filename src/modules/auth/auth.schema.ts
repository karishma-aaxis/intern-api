// Import Zod validation library
import { z } from "zod";

// Validation schema for user signup
export const signupSchema = z.object({
  name: z.string().min(1, "Name is required"), // User's full name
  email: z.email("Invalid email address"), // User's email address
  password: z.string().min(8, "Password must be at least 8 characters"), // Password must be at least 8 characters
});

// Validation schema for user login
export const loginSchema = z.object({
  email: z.email("Invalid email address"), // User's email address
  password: z.string().min(1, "Password is required"), // Password is required
});
