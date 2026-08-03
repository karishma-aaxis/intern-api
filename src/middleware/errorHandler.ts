// Import Express types
import type { NextFunction, Request, Response } from "express";

// Import Prisma error types
import { Prisma } from "@prisma/client";

// Import custom HTTP error class
import { HttpError } from "../utils/HttpError.js";

// Global error handling middleware
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  void _next;

  // Handle known application errors
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

 // Handle known Prisma database errors
if (err instanceof Prisma.PrismaClientKnownRequestError) {
  switch (err.code) {
    case "P2002":
      return res.status(409).json({
        error: "Resource already exists",
      });

    case "P2025":
      return res.status(404).json({
        error: "Resource not found",
      });

    default:
      return res.status(400).json({
        error: "Database operation failed",
      });
  }
}

  // Log unexpected errors for debugging
  console.error(err);

  // Return a generic error response to avoid exposing internal details
  return res.status(500).json({
    error: "Internal Server Error",
  });
};