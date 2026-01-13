import express from "express";
import {
  addCartItem,
  fetchCart,
  updateCartItem,
  deleteCartItem,
  deleteCart,
  allfetchCart,
} from "../controllers/cartController.js";
import { checkAuth, isAuthenticated, isAuthorized } from "../middleware/isAuthenticated.js";

import validate from "../middleware/validate.js";
import { addCartSchema, updateCartSchema } from "../utils/validationSchemas.js";

const router = express.Router();
router.post("/add/:productId", checkAuth, validate(addCartSchema), addCartItem);
router.get("/", checkAuth, fetchCart);
router.get('/allfetchCart', isAuthenticated, isAuthorized("admin", "superAdmin"), allfetchCart);
router.patch("/update/:id", checkAuth, validate(updateCartSchema), updateCartItem);
router.delete("/delete/:productId", checkAuth, deleteCartItem);
router.delete("/deleteCart/:cartId", checkAuth, deleteCart);

export default router;
