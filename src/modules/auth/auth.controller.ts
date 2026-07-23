//import re and res types from express;
import type { Request, Response } from "express";

//Import Prisma Client
import prisma from "../../lib/prisma.js";

// //import signup ,login schema
// import { signupSchema ,loginSchema } from "./auth.schema.js";

//import bcrypt for password hashing
import bcrypt from "bcrypt";

// Import helper function to generate JWT tokens after successful login
import { generateToken } from "../../lib/jwt.js";

//import role enum from Prisma
import { Role } from "@prisma/client";

//Create new user in the db
export const signup = async (req: Request, res: Response) => {
  try {
    //Request body is already validtae by the valdiate middlware
    const validateBody = req.body;

    //Check whether the email alraeady exists
    const exisitngUser = await prisma.user.findUnique({
      where: {
        email: validateBody.email,
      },
    });

    //return 409 if email already registerd
    if (exisitngUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    //hash password before storing it in the db
    const hashedPassword = await bcrypt.hash(validateBody.password, 10);

    //Create a new User in the db
    const createUser = await prisma.user.create({
      data: {
        name: validateBody.name,
        email: validateBody.email,
        password: hashedPassword,
        role: Role.CUSTOMER,
      },
      //Return selected fields (exclued password)
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    //return success response with created user details
    return res.status(201).json({
      success: true,
      data: createUser,
    });
  } catch (error) {
    // Log error for debugging
    console.error("Signup  error", error);
    // Send failure response
    return res.status(500).json({
      success: false,
      message: "Failed to register user",
    });
  }
};

//post /api/auth/login

export const login = async (req: Request, res: Response) => {
  console.log("Login API called");
  try {
    //Request body is already validtae by the valdiate middlware
    const validateBody = req.body;

    //find user by email
    const user = await prisma.user.findUnique({
      where: {
        email: validateBody.email,
      },
    });
    //User not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    //compared entered password with stoed hashed password
    const isPasswordValid = await bcrypt.compare(
      validateBody.password, //user enter passowrd
      user.password, //db passsowrd
    );

    // password is incorrect
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token after successful login
    const token = generateToken({
      userId: user.id, //check order belong to thisuser
      email: user.email, // to display logged-in user
      role: user.role, //role in middleware
    });

    //return success response with generated jwt token
    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("login Error", error);
    return res.status(500).json({
      success: false,
      message: ":login Failed",
    });
  }
};
