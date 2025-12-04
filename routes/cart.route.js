import express from "express";
import {
  addCartItem,
  fetchCart,
  updateCartItem,
  deleteCartItem,
  deleteCart,
} from "../controllers/cartController.js";

const router = express.Router();
router.post("/add/:productId", addCartItem);
router.get("/", fetchCart);
router.put("/update",updateCartItem);
router.delete("/delete/:productId", deleteCartItem);
router.delete("/deleteCart/:cartId", deleteCart);

export default router;
