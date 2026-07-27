// User Controller -> Handles user-related business logic

// Import Request and Response types from Express
import type { Request, Response } from "express";

// Import async handler wrapper
import { asyncHandler } from "../../middleware/asyncHandler.js";

// Import reusable Prisma database instance
import prisma from "../../lib/prisma.js";

// Import Zod schemas for route parameter validation
import {
  deleteUserSchema,
  getUserByIdSchema,
  updateUserParamsSchema,
} from "./users.schema.js";

// Import Role enum for authorization checks
import { Role } from "@prisma/client";

// GET /api/users -> Return all users (excluding passwords)
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  // Fetch all users from the database
  const users = await prisma.user.findMany({
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

  // Return the list of users
  return res.status(200).json({
    success: true,
    data: users,
  });
});

// GET /api/users/:id -> Return a user by ID
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  // Validate the route parameter
  const validatedParams = getUserByIdSchema.parse(req.params);

  // Allow only the user or an admin to access the profile
  if (
    req.user?.role !== Role.ADMIN &&
    req.user?.userId !== validatedParams.id
  ) {
    return res.status(403).json({
      error: "Access denied",
    });
  }

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

  // Return 404 if the user does not exist
  if (!user) {
    return res.status(404).json({
      error: "User not found",
    });
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

  // Allow only the user or an admin to update the profile
  if (
    req.user?.role !== Role.ADMIN &&
    req.user?.userId !== validatedParams.id
  ) {
    return res.status(403).json({
      error: "Access denied",
    });
  }

  // Request body is already validated by the validate middleware
  const validatedBody = req.body;

  // Check whether the user exists
  const existingUser = await prisma.user.findUnique({
    where: {
      id: validatedParams.id,
    },
  });

  // Return 404 if the user does not exist
  if (!existingUser) {
    return res.status(404).json({
      error: "User not found",
    });
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

  // Return 404 if the user does not exist
  if (!existingUser) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  // Count the user's existing orders
  const orderCount = await prisma.order.count({
    where: {
      userId: validatedParams.id,
    },
  });

  // Prevent deletion if the user has existing orders
  if (orderCount > 0) {
    return res.status(409).json({
      error: "Cannot delete user because they have existing orders.",
    });
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
