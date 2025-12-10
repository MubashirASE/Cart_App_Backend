import express from "express";
import { placeOrder } from "../controllers/orderController.js";
import { isAuthentication } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/placeOrder",isAuthentication, placeOrder);

export default router;
