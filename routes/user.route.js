import express from "express"
import { SignUp,Login, getAllUserData, userBlocked, userUnBlocked, getadminData, verifyOTP, resendVerification, adminSendMail, updateProfile } from "../controllers/userController.js";
import { User } from "../models/user.model.js";
import { isAuthentication, isAuthorized } from "../middleware/isAuthenticated.js";

const router=express.Router()

router.post('/signup',SignUp)
router.post('/login',Login)
router.get('/allUserData', isAuthentication, isAuthorized("admin", "superAdmin"), getAllUserData)
router.get('/alladminData', isAuthentication, isAuthorized("superAdmin"), getadminData)
router.patch('/userBlocked/:id', isAuthentication, isAuthorized("admin", "superAdmin"), userBlocked)
router.patch('/userUnBlocked/:id', isAuthentication, isAuthorized("admin", "superAdmin"), userUnBlocked)
router.post("/verify-otp", verifyOTP);
router.patch("/updateProfile", isAuthentication, updateProfile);
router.post("/resend-verification", resendVerification);
router.post("/sendMail/:id", isAuthentication, isAuthorized("admin", "superAdmin"), adminSendMail);


export default router