import express from "express"
import { SignUp,Login, getAllUserData, getadminData, verifyOTP, resendVerification, adminSendMail, updateProfile, createAdmin, unBlocked, blocked } from "../controllers/userController.js";
import { User } from "../models/user.model.js";
import { isAuthenticated, isAuthorized } from "../middleware/isAuthenticated.js";
import validate from "../middleware/validate.js";
import { signupSchema, loginSchema, idParamSchema } from "../utils/validationSchemas.js";

const router=express.Router()

router.post('/signup', validate(signupSchema), SignUp)
router.post('/login', validate(loginSchema), Login)
router.get('/allUserData', isAuthenticated, isAuthorized("admin", "superAdmin"), getAllUserData)
router.get('/alladminData', isAuthenticated, isAuthorized("superAdmin"), getadminData)
router.patch('/userBlocked/:id', isAuthenticated, isAuthorized("admin", "superAdmin"), validate(idParamSchema), blocked)
router.patch('/userUnBlocked/:id', isAuthenticated, isAuthorized("admin", "superAdmin"), validate(idParamSchema), unBlocked)
router.post("/verify-otp", verifyOTP);
router.patch("/updateProfile", isAuthenticated, updateProfile);
router.post("/resend-verification", resendVerification);
router.post("/sendMail/:id", isAuthenticated, isAuthorized("admin", "superAdmin"), adminSendMail);
router.post("/createAdmin", isAuthenticated, isAuthorized("superAdmin"), createAdmin);

export default router