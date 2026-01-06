import express from "express";
import {
  adminSignUp,
  adminLogin,
  getAllAdmins,
  adminBlocked,
  adminUnBlocked,
  updateAdminProfile,
} from "../controllers/adminController.js";
import { isAuthentication, isAuthorized } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/signup", adminSignUp);
router.post("/login", adminLogin);
router.get("/allAdmins", isAuthentication, isAuthorized("superAdmin"), getAllAdmins);
router.patch("/adminBlocked/:id", isAuthentication, isAuthorized("superAdmin"), adminBlocked);
router.patch("/adminUnBlocked/:id", isAuthentication, isAuthorized("superAdmin"), adminUnBlocked);
router.patch("/updateProfile", isAuthentication, updateAdminProfile);

export default router;
