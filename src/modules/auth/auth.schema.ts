//Import Zod Validation library
import { z } from "zod";

//Validate signup request  body
export const signupSchema = z.object({
  //Name is required
  name: z.string().min(1, "Name is required"),
  //Email must be valid
  email: z.email("Invalid email address"),
  //password must contain at least  8 charcters
  password: z.string().min(8, "password must be at least 8 charcters"),
});

//Validate login request body
export const loginSchema = z.object({
  //Email must be valid
  email: z.email("Invalid email address"),
  //Password is requrued
  password: z.string().min(1, "Password is required "),
});
