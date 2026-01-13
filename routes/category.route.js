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
import { isAuthenticated, isAuthorized } from "../middleware/isAuthenticated.js";
import upload from "../middleware/upload.js";
import validate from "../middleware/validate.js";
import { categorySchema, updateCategorySchema, idParamSchema } from "../utils/validationSchemas.js";

const router = express.Router();

router.get("/", getActiveCategories);
router.get("/:id", getCategoryById);
router.get("/:id/products", getCategoryWithProducts);
router.get("/admin/all", isAuthenticated, isAuthorized("admin", "superAdmin"), getAllCategoriesAdmin);
router.get("/user/all", getAllCategoriesUser);
router.get("/children/:parentId", isAuthenticated, getChildCategories);
router.post("/", isAuthenticated, isAuthorized("admin", "superAdmin"), upload.single("image"), validate(categorySchema), createCategory);
router.patch("/:id", isAuthenticated, isAuthorized("admin", "superAdmin"), upload.single("image"), validate(updateCategorySchema), updateCategory);
router.patch("/:id/disable", isAuthenticated, isAuthorized("admin", "superAdmin"), validate(idParamSchema), disableCategory);
router.delete("/:id", isAuthenticated, isAuthorized("admin", "superAdmin"),  deleteCategory);
export default router;
