import express from "express"
import { SignUp,Login, getAllUserData, getadminData, verifyOTP, resendVerification, adminSendMail, updateProfile, createAdmin, unBlocked, blocked } from "../controllers/userController.js";
import { User } from "../models/user.model.js";
import { isAuthentication, isAuthorized } from "../middleware/isAuthenticated.js";

const router=express.Router()

router.post('/signup',SignUp)
router.post('/login',Login)
router.get('/allUserData', isAuthentication, isAuthorized("admin", "superAdmin"), getAllUserData)
router.get('/alladminData', isAuthentication, isAuthorized("superAdmin"), getadminData)
router.patch('/userBlocked/:id', isAuthentication, isAuthorized("admin", "superAdmin"), blocked)
router.patch('/userUnBlocked/:id', isAuthentication, isAuthorized("admin", "superAdmin"), unBlocked)
router.post("/verify-otp", verifyOTP);
router.patch("/updateProfile", isAuthentication, updateProfile);
router.post("/resend-verification", resendVerification);
router.post("/sendMail/:id", isAuthentication, isAuthorized("admin", "superAdmin"), adminSendMail);
router.post("/createAdmin", isAuthentication, isAuthorized("superAdmin"), createAdmin);

export default router