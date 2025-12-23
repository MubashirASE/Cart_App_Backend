import express from "express";
import multer from "multer";
import { createProduct, fetchProducts, updateProduct, deleteProduct, fetchProductsByUser, fetchProductsByCategory, filterProductsByCategory } from "../controllers/productController.js";
import { isAuthentication, isAuthorized } from "../middleware/isAuthenticated.js";
import upload from '../middleware/upload.js'


const router = express.Router();
router.get("/", fetchProducts);
router.get("/category/:categoryId", fetchProductsByCategory);
router.post("/filter", filterProductsByCategory);
router.get("/userProducts", isAuthentication, fetchProductsByUser);
router.post("/add", isAuthentication, isAuthorized("admin", "superAdmin"), upload.single("image"), createProduct);
router.patch("/update", isAuthentication, isAuthorized("admin", "superAdmin"), upload.single("image"), updateProduct);
router.delete("/delete/:id", isAuthentication, isAuthorized("admin", "superAdmin"), deleteProduct);

export default router;
