import express from "express"
import { SignUp,Login, getAllUserData, userBlocked, userUnBlocked, getadminData, verifyOTP, getProfile, resendVerification, adminSendMail } from "../controllers/userController.js";
import { User } from "../models/user.model.js";
import { isAuthentication, isAuthentication as protect } from "../middleware/isAuthenticated.js";

const router=express.Router()

router.post('/signup',SignUp)
router.post('/login',Login)
router.get('/allUserData',getAllUserData)
router.get('/alladminData',getadminData)
router.patch('/userBlocked/:id',userBlocked)
router.patch('/userUnBlocked/:id',userUnBlocked)
router.post("/verify-otp", verifyOTP);
router.get("/profile", protect, getProfile);
router.post("/resend-verification", resendVerification);
router.post("/sendMail/:id",isAuthentication, adminSendMail);


export default router