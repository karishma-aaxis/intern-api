// Controller File->Handles request and response

// Import only TypeScript types from Express
// 'type' keyword is required because of verbatimModuleSyntax: true
import type { Request, Response } from "express";

// Import the reusable Prisma database instance
import prisma from "../../lib/prisma.js";

// import getUserByIdSchema from user.schema
import {
  deleteUserSchema,
  getUserByIdSchema,
  updateUserParamsSchema,
} from "./users.schema.js";

import { Role } from "@prisma/client";

// GET /api/users
// Returns all users except their passwords
export const getUsers = async (
  req: Request, // TypeScript: req must be an Express Request object
  res: Response, // TypeScript: res must be an Express Response object
) => {
  try {
    // Fetch all users from database
    const users = await prisma.user.findMany({
      select: {
        // Select only required fields
        id: true, //true-means "Include this field in the result"
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // password intentionally excluded
      },
    });

    // Send success response
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    // Log error for debugging
    console.error("Get Users Error:", error);

    // Send failure response
    return res.status(500).json({
      success: false,
      message: "Failed to fetch errors",
    });
  }
};

//GET /api/users/user:id
//returns a single user by id
export const getUserById = async (
  req: Request, //Express request object
  res: Response, //express response object
) => {
  try {
    // Validate the route parameter using zod
    const validatedData = getUserByIdSchema.parse(req.params);

    // Allow only admins or the user themselves
    if (
      req.user?.role !== Role.ADMIN &&
      req.user?.userId !== validatedData.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    //find user in db using the validated id
    const user = await prisma.user.findUnique({
      where: {
        id: validatedData.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    //Return 404 if user does not exist
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Send success response with the user data
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    // Log error for debugging
    console.error("Get User Error:", error);
    // Send failure response
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

//PATCH/api/users/:id-> Update a user's name or email
export const updateUser = async (req: Request, res: Response) => {
  try {
    //  Validate route paramter
    const validatedParams = updateUserParamsSchema.parse(req.params);

    // Allow only admins or the user themselves
    if (
      req.user?.role !== Role.ADMIN &&
      req.user?.userId !== validatedParams.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Validate request body
    const validatedBody = req.body;

    // Check whether the user exists in the database
    const existingUser = await prisma.user.findUnique({
      where: {
        id: validatedParams.id,
      },
    });
    // retun 404 if user is notfound
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create an empty object to store only the fields
    // that the user wants to update.
    // TypeScript: name and email are optional.
    const updateData: {
      name?: string;
      email?: string;
    } = {};
    // Check if a new name was provided in the request body.
    // If yes, add it to the update object.
    if (validatedBody.name !== undefined) {
      updateData.name = validatedBody.name;
    }
    // Check if a new email was provided in the request body.
    // If yes, add it to the update object.
    if (validatedBody.email !== undefined) {
      updateData.email = validatedBody.email;
    }
    // update the user in the db
    const user = await prisma.user.update({
      where: {
        //find user usng validiated id
        id: validatedParams.id,
      },

      // Update only the fields present in updateData.
      // This avoids sending undefined values to Prisma.
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    //retrun success response
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    //log error
    console.error("Update User error:", error);
    //retunr failure respnose
    return res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};
// DELETE /api/users/:id-> Delete a user by id
export const deleteUser = async (req: Request, res: Response) => {
  try {
    // Validate the route parameter using Zod
    const validatedParams = deleteUserSchema.parse(req.params);

    //Check whether the user exists in the db
    const existingUser = await prisma.user.findUnique({
      where: {
        id: validatedParams.id,
      },
    });
    // return 404 ifthe user does not exist
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Count how many order belong to the user
    const orderCount = await prisma.order.count({
      where: {
        userId: validatedParams.id,
      },
    });
    //Prevent deletion of the user has existing order
    if (orderCount > 0) {
      return res.status(409).json({
        success: false,
        message: "Cannot delete user because they have exisitng orders.",
      });
    }
    // Delete the user from db
    const user = await prisma.user.delete({
      where: {
        id: validatedParams.id,
      },
    });
    //send success respnse
    return res.status(200).json({
      success: true,
      message: "User data deleted Successfully below shown",
      data: user,
    });
  } catch (error) {
    // Log error for debugging
    console.error("Delete User error:", error);
    // Send failure response
    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// // POST /api/users->Create a new user
