import express from "express";
import {
  addCartItem,
  fetchCart,
  updateCartItem,
  deleteCartItem,
  deleteCart,
  allfetchCart,
} from "../controllers/cartController.js";
import { isAuthentication } from "../middleware/isAuthenticated.js";

const router = express.Router();
router.post("/add/:productId",isAuthentication, addCartItem);
router.get("/",isAuthentication, fetchCart);
router.get('/allfetchCart',isAuthentication, allfetchCart);
router.put("/update",isAuthentication,updateCartItem);
router.delete("/delete/:productId",isAuthentication, deleteCartItem);
router.delete("/deleteCart/:cartId",isAuthentication, deleteCart);

export default router;
