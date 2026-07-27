// Import Request and Response types from Express
import type { Request, Response } from "express";

// Import async handler wrapper
import { asyncHandler } from "../../middleware/asyncHandler.js";

// Import Prisma Client for database operations
import prisma from "../../lib/prisma.js";

// Import bcrypt for password hashing and verification
import bcrypt from "bcrypt";

// Import helper function to generate JWT tokens after successful login
import { generateToken } from "../../lib/jwt.js";

// Import Role enum to assign a default role to new users
import { Role } from "@prisma/client";

// Signup

// Register a new user
export const signup = asyncHandler(async (req: Request, res: Response) => {
  // Request body is already validated by the validate middleware
  const validatedBody = req.body;

  // Check if the email is already registered
  const existingUser = await prisma.user.findUnique({
    where: {
      email: validatedBody.email,
    },
  });

  // Return 409 Conflict if the email already exists
  if (existingUser) {
    return res.status(409).json({
      error: "Email already exists",
    });
  }

  // Hash the password before storing it in the database
  const hashedPassword = await bcrypt.hash(validatedBody.password, 10);

  // Create a new user in the database
  const createUser = await prisma.user.create({
    data: {
      name: validatedBody.name,
      email: validatedBody.email,
      password: hashedPassword,
      role: Role.CUSTOMER, // Assign the default CUSTOMER role
    },

    // Return only safe fields (exclude password)
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Return the newly created user
  return res.status(201).json({
    success: true,
    data: createUser,
  });
});

// Login

// Authenticate an existing user
export const login = asyncHandler(async (req: Request, res: Response) => {
  // Request body is already validated by the validate middleware
  const validatedBody = req.body;

  // Find the user by email
  const user = await prisma.user.findUnique({
    where: {
      email: validatedBody.email,
    },
  });

  // Return 401 if the user does not exist
  if (!user) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }

  // Compare the entered password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(
    validatedBody.password, // Password entered by the user
    user.password, // Hashed password stored in the database
  );

  // Return 401 if the password is incorrect
  if (!isPasswordValid) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }

  // Generate a JWT token after successful login
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  // Return the generated JWT token to the client
  return res.status(200).json({
    success: true,
    token,
  });
});
