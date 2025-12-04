import express from "express";
import multer from "multer";
import { createProduct, fetchProducts, updateProduct, deleteProduct } from "../controllers/productController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); 
router.get("/", fetchProducts);
router.post("/add", upload.single("image"), createProduct);
router.patch("/update", upload.single("image"), updateProduct);
router.delete("/delete/:id", deleteProduct);

export default router;
