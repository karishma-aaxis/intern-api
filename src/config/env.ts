// Load environment variables
import "dotenv/config";

import { z } from "zod";

// Define environment variable schema
const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  PORT: z.string().default("3000"),
});

// Validate environment variables
export const env = envSchema.parse(process.env);