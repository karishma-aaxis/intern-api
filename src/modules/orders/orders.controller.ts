// Controller File -> Handles request and response

// Import only TypeScript types from Express
import type { Request, Response } from "express";

// Import reusable Prisma database instance
import prisma from "../../lib/prisma.js";

// Import Zod schema
import {
  createOrderschema,
  deleteOrderSchema,
  getOrderByIdSchema,
  updateOrderByBodySchema,
  updateorderByIdSchema,
} from "./orders.schema.js";

import { Role } from "@prisma/client";

// POST /api/orders-> Create a new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    // Validate request body using Zod
    const validatedBody = createOrderschema.parse(req.body);
    const userId = req.user!.userId;

    // Check whether the user exists

    // const existingUser = await prisma.user.findUnique({
    //   where: {
    //     id: validatedBody.userId,
    //   },
    // });

    // Return 404 if user does not exist
    // if (!existingUser) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "User not found",
    //   });
    // }
    // Calculate total amount on the server
    // (price × quantity for each item)
    const totalAmount = validatedBody.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    // Create order in database
    // create order in db
    const order = await prisma.order.create({
      data: {
        userId,
        items: validatedBody.items,
        totalAmount: totalAmount,
      },
    });

    // Return success response
    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    // Log error for debugging
    console.error("Create order error:", error);

    // Return failure response
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};
// GET /api/orders-> Get Order
export const getOrders = async (req: Request, res: Response) => {
  try {
    // // Fetch all orders from the database
    // const orders = await prisma.order.findMany();
    let orders;

    if (req.user?.role === Role.ADMIN) {
      orders = await prisma.order.findMany();
    } else {
      orders = await prisma.order.findMany({
        where: {
          userId: req.user!.userId,
        },
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    // Log error for debugging
    console.error("Get Order error:", error);

    // Return failure response
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// GET /api/orders/:id->Returns a single order by id
export const getOrdersById = async (req: Request, res: Response) => {
  try {
    // Validate the route parameter using Zod
    const validatedParams = getOrderByIdSchema.parse(req.params);

    // Find order in database using the validated id
    const order = await prisma.order.findUnique({
      where: {
        id: validatedParams.id,
      },
    });

    // Return 404 if order does not exist
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (req.user?.role !== Role.ADMIN && order.userId !== req.user?.userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    // Log error for debugging
    console.log("Get Order error", error);

    // Return failure response
    return res.status(500).json({
      success: false,
      message: "Failed to fetch",
    });
  }
};

// PATCH /api/orders/:id/status->Update an order's status
export const udpateOrderStatus = async (req: Request, res: Response) => {
  try {
    // Validate route parameter
    const validatedParams = updateorderByIdSchema.parse(req.params);

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
        success: false,
        message: "Order not found",
      });
    }

    // Update order status
    const updateOrder = await prisma.order.update({
      where: {
        id: validatedParams.id,
      },
      data: {
        status: validatedBody.status,
      },
    });

    // Return success response
    return res.status(200).json({
      success: true,
      data: updateOrder,
    });
  } catch (error) {
    // Log error for debugging
    console.error("Update roder status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

// DELETE /api/orders/:id-> Delete an order by id
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
        success: false,
        message: "Order not found",
      });
    }

    // Delete order from database
    const deleteOrder = await prisma.order.delete({
      where: {
        id: validatedParams.id,
      },
    });

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Order dlelted successflly below shown",
      data: deleteOrder,
    });
  } catch (error) {
    // Log error for debugging
    console.error("Delete Order error:", error);

    // Return failure response
    return res.status(500).json({
      success: false,
      message: "Failed to Delete order",
    });
  }
};
