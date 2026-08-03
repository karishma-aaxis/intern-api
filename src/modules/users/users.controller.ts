// User Controller -> Handles user-related business logic

// Import Request and Response types from Express
import type { Request, Response } from "express";

// Import async handler wrapper
import { asyncHandler } from "../../middleware/asyncHandler.js";

// Import custom HTTP error class for application-specific errors
import { HttpError } from "../../utils/HttpError.js";

// Import reusable Prisma database instance
import prisma from "../../lib/prisma.js";

// Import Zod schemas for route parameter validation
import {
  deleteUserSchema,
  getUserByIdSchema,
  updateUserParamsSchema,
} from "./users.schema.js";


// GET /api/users -> Return all users (excluding passwords)
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  
  // Read pagination values from query parameters
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);

  // Calculate how many records to skip
  const skip = (page - 1) * limit;

  // Count the total number of users
  const totalUsers = await prisma.user.count();

  
  // Fetch users for the current page
  const users = await prisma.user.findMany({
    skip,
    take: limit,

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

  return res.status(200).json({
  success: true,
  page,
  limit,
  totalUsers,
  totalPages: Math.ceil(totalUsers / limit),
  data: users,
});
});

// GET /api/users/:id -> Return a user by ID
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  // Validate the route parameter
  const validatedParams = getUserByIdSchema.parse(req.params);

  

  // Find the user by ID
  const user = await prisma.user.findUnique({
    where: {
      id: validatedParams.id,
    },

    // Return only safe fields
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Throw a 404 Not Found error if the user does not exist
  if (!user) {
    throw new HttpError(404, "User not found");
  }

  // Return user details
  return res.status(200).json({
    success: true,
    data: user,
  });
});

// PATCH /api/users/:id -> Update a user's name or email
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  // Validate the route parameter
  const validatedParams = updateUserParamsSchema.parse(req.params);


  // Request body is already validated by the validate middleware
  const validatedBody = req.body;

  // Check whether the user exists
  const existingUser = await prisma.user.findUnique({
    where: {
      id: validatedParams.id,
    },
  });

  // Throw a 404 Not Found error if the user does not exist
  if (!existingUser) {
    throw new HttpError(404, "User not found");
  }

  // Create an object to store only the fields that need to be updated
  const updateData: {
    name?: string;
    email?: string;
  } = {};

  // Update name if provided
  if (validatedBody.name !== undefined) {
    updateData.name = validatedBody.name;
  }

  // Update email if provided
  if (validatedBody.email !== undefined) {
    updateData.email = validatedBody.email;
  }

  // Update the user in the database
  const user = await prisma.user.update({
    where: {
      id: validatedParams.id,
    },

    // Update only provided fields
    data: updateData,

    // Return only safe fields
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Return updated user details
  return res.status(200).json({
    success: true,
    data: user,
  });
});

// DELETE /api/users/:id -> Delete a user
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  // Validate the route parameter
  const validatedParams = deleteUserSchema.parse(req.params);

  // Check whether the user exists
  const existingUser = await prisma.user.findUnique({
    where: {
      id: validatedParams.id,
    },
  });

  // Throw a 404 Not Found error if the user does not exist
  if (!existingUser) {
   throw new HttpError(404, "User not found");
  }

  // Count the user's existing orders
  const orderCount = await prisma.order.count({
    where: {
      userId: validatedParams.id,
    },
  });

 // Throw a 409 Conflict error if the user has existing orders
  if (orderCount > 0) {
    throw new HttpError(
    409,
    "Cannot delete user because they have existing orders.",
  );
  }

  // Delete the user from the database
  const user = await prisma.user.delete({
    where: {
      id: validatedParams.id,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });

  // Return success response
  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: user,
  });
});
