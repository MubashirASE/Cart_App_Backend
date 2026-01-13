import express from "express";
import multer from "multer";
import { createProduct, fetchProducts, updateProduct, deleteProduct, fetchProductsByUser, fetchProductsByCategory, filterProductsByCategory } from "../controllers/productController.js";
import { isAuthenticated, isAuthorized } from "../middleware/isAuthenticated.js";
import upload from '../middleware/upload.js'
import validate from "../middleware/validate.js";
import { productSchema, updateProductSchema } from "../utils/validationSchemas.js";


const router = express.Router();
router.get("/", fetchProducts);
router.get("/category/:categoryId", fetchProductsByCategory);
router.post("/filter", filterProductsByCategory);
router.get("/userProducts", isAuthenticated, fetchProductsByUser);
router.post("/add", isAuthenticated, isAuthorized("admin", "superAdmin"), upload.single("image"), validate(productSchema), createProduct);
router.patch("/update", isAuthenticated, isAuthorized("admin", "superAdmin"), upload.single("image"), validate(updateProductSchema), updateProduct);
router.delete("/delete/:id", isAuthenticated, isAuthorized("admin", "superAdmin"), deleteProduct);

export default router;
