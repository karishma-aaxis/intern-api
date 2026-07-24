// Import Zod validation library
import { z } from "zod";

// Import OrderStatus enum from Prisma
import { OrderStatus } from "@prisma/client";

// Order Item Schema

// Validate a single item inside an order
export const orderItemSchema = z.object({
  productId: z.string().min(1, "Product id is required"), // Product ID must not be empty
  name: z.string().min(1, "Product name is required"), // Product name must not be empty
  price: z.number().positive("Price must be greater than 0"), // Price must be greater than 0
  quantity: z.number().int().min(1, "Quantity must be at least 1"), // Quantity must be at least 1
});

//  Create Order Schema

// Validate request body for creating a new order
export const createOrderschema = z.object({
  items: z
    .array(orderItemSchema)
    .min(1, "Order must contain at least one item"), // Validate the list of ordered items
});

// Get Order By ID Schema

// Validate order ID from route parameters
export const getOrderByIdSchema = z.object({
  id: z.string().min(1, "Order id is required"), // Order ID must not be empty
});

//  Update Order Schema

// Validate order ID from route parameters
export const updateOrderByIdSchema = z.object({
  id: z.string().min(1, "Order id is required"), // Order ID must not be empty
});

// Validate request body for updating order status
export const updateOrderByBodySchema = z.object({
  status: z.nativeEnum(OrderStatus), // Status must be one of the OrderStatus enum values
});

//Delete Order Schema

// Validate order ID from route parameters
export const deleteOrderSchema = z.object({
  id: z.string().min(1, "Order id is required"), // Order ID must not be empty
});
