// Import Request, Response, and NextFunction types from Express
import type { Request, Response, NextFunction } from "express";

// Import jsonwebtoken library
import jwt from "jsonwebtoken";

//Import Role enum from Prisma
import { Role } from "@prisma/client";

// Middleware to verify JWT before allowing access to protected routes
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Read Authorization header
  const authHeader = req.headers.authorization;

  // Check if Authorization header is missing
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Authorization token is required",
    });
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.split(" ")[1];

  // Check if token is missing
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token is missing",
    });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // Attach authenticated user information to the request
    req.user = decoded as {
      userId: string;
      email: string;
      role: Role;
    };

    // Continue to the next middleware or route handler
    next();
  } catch {
    // Return 401 if token is invalid or expired
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
