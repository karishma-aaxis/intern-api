// Import Role enum from Prisma
import { Role } from "@prisma/client";

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
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
