import express from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  disableCategory,
  getAllCategoriesAdmin,
  getActiveCategories,
  getCategoryById,
  getCategoryWithProducts,
  getAllCategoriesUser,
  getChildCategories
} from "../controllers/categoryController.js";
import { isAuthentication, isAuthorized } from "../middleware/isAuthenticated.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getActiveCategories);
router.get("/:id", getCategoryById);
router.get("/:id/products", getCategoryWithProducts);
router.get("/admin/all", isAuthentication, isAuthorized("admin", "superAdmin"), getAllCategoriesAdmin);
router.get("/user/all", isAuthentication, getAllCategoriesUser);
router.get("/children/:parentId", isAuthentication, getChildCategories);
router.post("/", isAuthentication, isAuthorized("admin", "superAdmin"), upload.single("image"),  createCategory);
router.patch("/:id", isAuthentication, isAuthorized("admin", "superAdmin"), upload.single("image"), updateCategory);
router.patch("/:id/disable", isAuthentication, isAuthorized("admin", "superAdmin"), disableCategory);
router.delete("/:id", isAuthentication, isAuthorized("admin", "superAdmin"),  deleteCategory);
export default router;
