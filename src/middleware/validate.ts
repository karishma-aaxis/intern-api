//Import  request ,response and Nextfunction types from express
import type { Request, Response, NextFunction } from "express";

//Import XZod Schema type
import type { ZodSchema } from "zod";

//generic middleware to valiadate request body using a Zod schema

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request body using the provided Zod schema
      schema.parse(req.body);

      // Validation passed, continue to the next middleware/controller
      return next();
    } catch (error) {
      // Return 400 if validation fails
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error,
      });
    }
  };
};
