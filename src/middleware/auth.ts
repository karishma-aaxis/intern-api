// Import Request, Response, and NextFunction types from Express
import type { Request, Response, NextFunction } from "express";

// Import jsonwebtoken library
import jwt from "jsonwebtoken";

// Import Role enum from Prisma
import type { Role } from "@prisma/client";

// Middleware to verify JWT before allowing access to protected routes
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Read the Authorization header
  const authHeader = req.headers.authorization;

  // Return 401 if the Authorization header is missing
  if (!authHeader) {
    return res.status(401).json({
      error: "Authorization token is required",
    });
  }

  // Extract the JWT token from "Bearer <token>"
  const token = authHeader.split(" ")[1];

  // Return 401 if the token is missing
  if (!token) {
    return res.status(401).json({
      error: "Token is missing",
    });
  }

  try {
    // Verify the JWT token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // Attach the authenticated user's information to the request
    req.user = decoded as {
      userId: string;
      email: string;
      role: Role;
    };

    // Token is valid, continue to the next middleware or controller
    next();
  } catch {
    // Return 401 if the token is invalid or expired
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
};
