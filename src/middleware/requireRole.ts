//import Request,Response and NextFunction types from Expresss
import type { Request, Response, NextFunction } from "express";

//import Role enum fron Prisma
import { Role } from "@prisma/client";

//Middleware Factory to allow only user woth a specific role
export const requireRole = (role: Role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    //Check if the authneicted user has the required role
    if (req.user?.role !== role) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    //User has the required role
    return next();
  };
};
