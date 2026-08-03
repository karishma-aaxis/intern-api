// Import Express types
import type { NextFunction, Request, Response } from "express";

// Import Role enum from Prisma
import { Role } from "@prisma/client";

// Import custom HTTP error class
import { HttpError } from "../utils/HttpError.js";

// Allow access only to the resource owner or an admin
export const requireOwnerOrAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  // Get the resource owner's ID from the route parameter
  const ownerId = req.params.id;

  // Allow access if the user is an admin
  if (req.user?.role === Role.ADMIN) {
    return next();
  }

  // Allow access if the authenticated user owns the resource
  if (req.user?.userId === ownerId) {
    return next();
  }

  // Deny access to everyone else
  throw new HttpError(403, "Access denied");
};