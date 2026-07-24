// Import Request, Response, and NextFunction types from Express
import type { Request, Response, NextFunction } from "express";

// Import Role enum from Prisma for ROLES
import { Role } from "@prisma/client";

// Reusable middleware to allow access only to users with the required role
export const requireRole = (role: Role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check whether the authenticated user has the required role
    if (req.user?.role !== role) {
      return res.status(403).json({
        error: "Access denied",
      });
    }

    // User has the required role, continue to the next middleware or controller
    return next();
  };
};
