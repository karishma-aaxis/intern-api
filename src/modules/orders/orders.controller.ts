// Order Controller -> Handles order-related business logic

// Import Request and Response types from Express
import type { Request, Response } from "express";

// Import reusable Prisma database instance
import prisma from "../../lib/prisma.js";

// Import Zod schemas for request validation
import {
  createOrderschema,
  deleteOrderSchema,
  getOrderByIdSchema,
  updateOrderByBodySchema,
  updateOrderByIdSchema,
} from "./orders.schema.js";

// Import Role enum for authorization checks
import { Role } from "@prisma/client";

// POST /api/orders -> Create a new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedBody = createOrderschema.parse(req.body);

    // Get authenticated user's ID from JWT
    const userId = req.user!.userId;

    // Calculate total amount on the server
    const totalAmount = validatedBody.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    // Create a new order
    const order = await prisma.order.create({
      data: {
        userId,
        items: validatedBody.items,
        totalAmount,
      },
    });

    // Return created order
    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    // Log error for debugging
    console.error("Create Order Error:", error);

    // Return internal server error
    return res.status(500).json({
      error: "Failed to create order",
    });
  }
};

// GET /api/orders -> Return orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    let orders;

    // Admin can view all orders
    if (req.user?.role === Role.ADMIN) {
      orders = await prisma.order.findMany();
    } else {
      // Customers can view only their own orders
      orders = await prisma.order.findMany({
        where: {
          userId: req.user!.userId,
        },
      });
    }

    // Return orders
    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    // Log error for debugging
    console.error("Get Orders Error:", error);

    // Return internal server error
    return res.status(500).json({
      error: "Failed to fetch orders",
    });
  }
};

// GET /api/orders/:id -> Return an order by ID
export const getOrdersById = async (req: Request, res: Response) => {
  try {
    // Validate route parameter
    const validatedParams = getOrderByIdSchema.parse(req.params);

    // Find the order
    const order = await prisma.order.findUnique({
      where: {
        id: validatedParams.id,
      },
    });

    // Return 404 if order does not exist
    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    // Allow only the order owner or an admin
    if (req.user?.role !== Role.ADMIN && order.userId !== req.user?.userId) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    // Return order details
    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    // Log error for debugging
    console.error("Get Order Error:", error);

    // Return internal server error
    return res.status(500).json({
      error: "Failed to fetch order",
    });
  }
};

// PATCH /api/orders/:id/status -> Update an order's status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    // Validate route parameter
    const validatedParams = updateOrderByIdSchema.parse(req.params);

    // Validate request body
    const validatedBody = updateOrderByBodySchema.parse(req.body);

    // Check whether the order exists
    const existingOrder = await prisma.order.findUnique({
      where: {
        id: validatedParams.id,
      },
    });

    // Return 404 if order does not exist
    if (!existingOrder) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: {
        id: validatedParams.id,
      },
      data: {
        status: validatedBody.status,
      },
    });

    // Return updated order
    return res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    // Log error for debugging
    console.error("Update Order Status Error:", error);

    // Return internal server error
    return res.status(500).json({
      error: "Failed to update order status",
    });
  }
};

// DELETE /api/orders/:id -> Delete an order
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    // Validate route parameter
    const validatedParams = deleteOrderSchema.parse(req.params);

    // Check whether the order exists
    const existingOrder = await prisma.order.findUnique({
      where: {
        id: validatedParams.id,
      },
    });

    // Return 404 if order does not exist
    if (!existingOrder) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    // Delete the order
    const deletedOrder = await prisma.order.delete({
      where: {
        id: validatedParams.id,
      },
    });

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      data: deletedOrder,
    });
  } catch (error) {
    // Log error for debugging
    console.error("Delete Order Error:", error);

    // Return internal server error
    return res.status(500).json({
      error: "Failed to delete order",
    });
  }
};
