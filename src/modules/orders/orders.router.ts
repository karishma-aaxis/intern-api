// Router File -> Defines API endpoints

import { authenticate } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/requireRole.js";
import { Role } from "@prisma/client";

// Import Router function from Express->Import ExpressRouter type for TypeScript
import { Router, type Router as ExpressRouter } from "express";

// Import contoller function
import {
  createOrder,
  getOrders,
  getOrdersById,
  udpateOrderStatus,
  deleteOrder,
} from "./orders.controller.js";
import { validate } from "../../middleware/validate.js";
import { createOrderschema, updateOrderByBodySchema } from "./orders.schema.js";

// Create router instance/object
const router: ExpressRouter = Router();

// POST /api/orders -> Create a new order
router.post("/", authenticate, validate(createOrderschema), createOrder);

//GET /api/orders->get orders
router.get("/", authenticate, getOrders);

// GET /api/users/:id->Returns a single user by id
router.get("/:id", authenticate, getOrdersById);

// PATCH /api/orders/:id/status->Update an order's status
router.patch(
  "/:id/status",
  authenticate,
  requireRole(Role.ADMIN),
  validate(updateOrderByBodySchema),
  udpateOrderStatus,
);

router.delete("/:id", authenticate, requireRole(Role.ADMIN), deleteOrder);

// Export router
export default router;
