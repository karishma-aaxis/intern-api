// Import Request and Response types
import type { Request, Response } from "express";

// Handle unknown routes
export const notFound = (_req: Request, res: Response) => {
  return res.status(404).json({
    error: "Route not found",
  });
};
