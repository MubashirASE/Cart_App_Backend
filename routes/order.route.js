import express from "express";
import {  getOrderById, getOrders, placeOrder, updateOrderStatus } from "../controllers/orderController.js";
import { checkAuth, isAuthenticated } from "../middleware/isAuthenticated.js";
import validate from "../middleware/validate.js";
import { orderSchema, updateOrderStatusSchema } from "../utils/validationSchemas.js";

const router = express.Router();

router.post("/placeOrder", checkAuth, validate(orderSchema), placeOrder);
router.get("/getOrders",isAuthenticated, getOrders);
router.patch("/status/:id",isAuthenticated, validate(updateOrderStatusSchema), updateOrderStatus);
router.get("/getOrderById",checkAuth, getOrderById);

export default router;
