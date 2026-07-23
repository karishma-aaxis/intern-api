//Import Zod Validation library
import { z } from "zod";
import { OrderStatus } from "@prisma/client";

// Schema for a single order item
export const orderItemSchema = z.object({
  // Product id must be a non-empty string
  productId: z.string().min(1, "Product id is required"),
  // Product name must be a non-empty string
  name: z.string().min(1, "Product name is required"),
  // Product name must be a non-empty string
  price: z.number().positive("Price must be greter then 0"),
  // Quantity must be at least 1
  quantity: z.number().int().min(1, "Quantity must be at least"),
});

// Schema to create a new order
export const createOrderschema = z.object({
  // User id who is placing the order
  // (Temporary for learning. Later we'll get it from JWT.)
  // userId: z.string().min(1, "User id id required"),

  // Order must contain at least one item
  items: z.array(orderItemSchema).min(1, "Order mustcontain at least one item"),
});

// Sechma to validate order id from route paramter
export const getOrderByIdSchema = z.object({
  // Order id must be a non-empty string
  id: z.string().min(1, "Order id is required"),
});

// Schema to validiate order id for update
export const updateorderByIdSchema = z.object({
  // Order id must not be empty
  id: z.string().min(1, "Order id is required"),
});

// Validate request body
export const updateOrderByBodySchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

// Schema to vlaidate the order id for delete
export const deleteOrderSchema = z.object({
  id: z.string().min(1, "Order id is required"),
});
