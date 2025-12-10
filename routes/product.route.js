import express from "express";
import multer from "multer";
import { createProduct, fetchProducts, updateProduct, deleteProduct, fetchProductsByUser } from "../controllers/productController.js";
import { isAuthentication } from "../middleware/isAuthenticated.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); 
router.get("/", fetchProducts);
router.get("/userProducts", isAuthentication, fetchProductsByUser
);
router.post("/add", isAuthentication,upload.single("image"), createProduct);
router.patch("/update",isAuthentication, upload.single("image"), updateProduct);
router.delete("/delete/:id", isAuthentication,deleteProduct);

export default router;
