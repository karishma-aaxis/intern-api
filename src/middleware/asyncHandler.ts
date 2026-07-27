// Import Express types
import type { NextFunction, Request, Response } from "express";

// Wrap asynchronous route handlers and forward errors to the global error handler
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  // Return a middleware function
  (req: Request, res: Response, next: NextFunction) => {
    // Execute the async function and pass any errors to the global error handler
    Promise.resolve(fn(req, res, next)).catch(next);
  };
