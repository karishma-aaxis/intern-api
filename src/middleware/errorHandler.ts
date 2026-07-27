// Import Express types
import type { NextFunction, Request, Response } from "express";

// Global error handling middleware
export const errorHandler = (
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Prevent ESLint unused variable error
  void _next;

  // Use custom status code if available, otherwise default to 500
  const statusCode = err.statusCode || 500;

  // Return error response
  return res.status(statusCode).json({
    error: err.message || "Internal Server Error",
  });
};
