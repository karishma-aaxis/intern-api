// extend request.user in Express request  used in code
//defines the structure of req.user(used by middlware and controllers)
// Import Role enum from Prisma
import { Role } from "@prisma/client";

// Extend Express's Request interface
declare global {
  namespace Express {
    interface Request {
      // Add authenticated user information to req.user
      user?: {
        userId: string;
        email: string;
        role: Role;
      };
    }
  }
}

// Make this file a module
export {};
