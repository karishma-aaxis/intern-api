// Import Request, Response, and NextFunction types from Express
import type { Request, Response, NextFunction } from "express";

// Import ZodType type passed to the middleware (accepts any zod schema)
import type { ZodType } from "zod";

// Reusable middleware to validate the request body using a Zod schema
// Receives a Zod schema (like signupSchema or loginSchema).
export const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the incoming request body against the provided Zod schema
      //Checks whether the request body matches the rules defined in the Zod schema.
      schema.parse(req.body);

      // If Validation  is passed, continue to the next middleware or controller
      return next();
    } catch (error) {
      // Return 400 Bad Request if validation fails
      return res.status(400).json({
        error: "Validation failed",
        details: error,
      });
    }
  };
};
