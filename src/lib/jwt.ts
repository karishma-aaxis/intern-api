//import jsonwebtoken library
import jwt from "jsonwebtoken";

// Import Role enum from Prisma
import { Role } from "@prisma/client";

//Function to generate JWttoken
export const generateToken = (payload: {
  userId: string;
  email: string;
  role: Role;
}) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    // Create token
    expiresIn: "7d",
  });
};

//JWT uses this secret to sign the token.
//uses the same secret to verify the token.
