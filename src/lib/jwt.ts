// Import jsonwebtoken library to generate JWT tokens
import jwt from "jsonwebtoken";

// Import Role enum from Prisma
import type { Role } from "@prisma/client";

// Import validated environment variables
import { env } from "../config/env.js";

// Generate a JWT token for an authenticated user
export const generateToken = (payload: {
  userId: string;
  email: string;
  role: Role; // User information stored in the JWT payload
}) => {
   // Sign the payload using the validated secret key and create secure JWT
  return jwt.sign(payload, env.JWT_SECRET, {
    // Token expires after 7 days
    expiresIn: "7d",
  });
};

// JWT uses this secret to sign the token.
// uses the same secret to verify the token.
