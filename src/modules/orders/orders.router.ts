// Order Router -> Defines order API routes

// Import Router from Express
import { Router, type Router as ExpressRouter } from "express";

// Import order controller functions
import {
  createOrder,
  getOrders,
  getOrdersById,
  updateOrderStatus,
  deleteOrder,
} from "./orders.controller.js";

// Import authentication middleware
import { authenticate } from "../../middleware/auth.js";

// Import role-based authorization middleware
import { requireRole } from "../../middleware/requireRole.js";

// Import request validation middleware
import { validate } from "../../middleware/validate.js";

// Import Zod schemas for request validation
import { createOrderschema, updateOrderByBodySchema } from "./orders.schema.js";

// Import Role enum
import { Role } from "@prisma/client";

// Create a new router instance
const router: ExpressRouter = Router();

// POST /api/orders -> Create a new order (Authenticated users only)
router.post("/", authenticate, validate(createOrderschema), createOrder);

// GET /api/orders -> Return orders (Admin: all orders, Customer: own orders)
router.get("/", authenticate, getOrders);

// GET /api/orders/:id -> Return an order by ID (Admin or order owner)
router.get("/:id", authenticate, getOrdersById);

// PATCH /api/orders/:id/status -> Update order status (Admin only)
router.patch(
  "/:id/status",
  authenticate,
  requireRole(Role.ADMIN),
  validate(updateOrderByBodySchema),
  updateOrderStatus,
);

// DELETE /api/orders/:id -> Delete an order (Admin only)
router.delete("/:id", authenticate, requireRole(Role.ADMIN), deleteOrder);

// Export router
export default router;
