
import { generateToken } from "../middleware/generateToken.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import {User} from "../models/user.model.js"

import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.js";


export const SignUp = async (req, res) => {
  try {
    const { name, email, password, role} = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields are required!" });
    }

    const userData = await User.findOne({ email });
    if (userData) return res.json({ success: false, message: "Email already exists!" });

    const hashPassword = await bcrypt.hash(password, 10);
  
    if(role === "admin"){
        const adminUser = await User.create({
        name,
        email,
        password: hashPassword,
        role,
        isVerified: true,
      });
      return res.status(201).json({
        success: true,
        message: "Admin Created. Check your email for the OTP.",
      });
    
    }
      const user = await User.create({
        name,
        email,
        password: hashPassword,
        role,
        isVerified: false,
      });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.verificationToken = otp;
      user.verificationTokenExpires = Date.now() + 1000 * 60 * 60; 
      await user.save();

      const html = `<h3>Verify your account</h3>
                    <p>Your verification code is : <b>${otp}</b></p>`;
      console.log(email)
      await sendEmail({ to: email, subject: "Verify your account", html });

      return res.status(201).json({
        success: true,
        message: "User created. Check your email for the OTP.",
      });  
    
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message:error});
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const user = await User.findOne({
      email,
      verificationToken: otp,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return generateToken(res, user, "Email verified successfully!");

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.isVerified) return res.json({ success: false, message: "Email is already verified" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationToken = otp;
    user.verificationTokenExpires = Date.now() + 1000 * 60 * 60; // 1 hour
    await user.save();

    const html = `<h3>Verify your account</h3>
                  <p>Your new verification code is: <b>${otp}</b></p>`;

    // await sendEmail({ to: email, subject: "Verify your account", html });
await sendEmail({
  to: email,
  subject: "Verify your account",
  html,
});

    return res.json({ success: true, message: "Verification OTP resent successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to resend verification email" });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await User.findOne({ email });

    if (!data) {
      return res.json({ success: false, message: "Invalid Email!" });
    }

    const isPassword = await bcrypt.compare(password, data.password);
    if (!isPassword) {
      return res.json({ success: false, message: "Incorrect Password!" });
    }

    if (!data.isVerified) {
      const token = crypto.randomBytes(32).toString("hex");
      data.verificationToken = token;
      data.verificationTokenExpires = Date.now() + 1000 * 60 * 60;
      await data.save();

      const verifyUrl = `${process.env.BACKEND_URL}/api/user/verify/${token}`;
      const html = `<h3>Verify your account </h3>
                    <p>Click link to verify:</p>
                    <a href="${verifyUrl}">${verifyUrl}</a>`;

      await sendEmail({
        to: email,
        subject: "Verify your admin account",
        html,
      });

      return res.json({
        success: false,
        message: "Please verify your email. A new verification link has been sent!",
      });
    }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      data.verificationToken = otp;
      data.verificationTokenExpires = Date.now() + 1000 * 60 * 15; 
      await data.save();

      const html = `<h3>Login Verification</h3>
                    <p>Your login verification code is: <b>${otp}</b></p>`;
      
      await sendEmail({ to: email, subject: "Login OTP", html });

      return res.json({
        success: true,
        requireOtp: true,
        message: "OTP sent to your email. Please verify to login.",
      });


  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Login failed!" });
  }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getAllUserData= async (req, res) => {
  try {
const userData = await User.find({
  role: { $nin: ["admin", "superAdmin"] }
}).select("-password");
    console.log(userData)
    return res.json({
      success: true,
      data: userData
    });

  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "User Data failed!"
    });
  }
};
export const getadminData= async (req, res) => {
  try {

    const adminData= await User.find({role:{$eq:"admin"}}).select("-password");
    console.log(adminData)
    return res.json({
      success: true,
      data: adminData
    });

  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "admin Data failed!"
    });
  }
};
export const userBlocked=async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isBlocked: true },
    { new: true }
  );

  res.json({
    success: true,
    message: "User blocked",
    user
  });
}
export const userUnBlocked=async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isBlocked: false },
    { new: true }
  );

  res.json({
    success: true,
    message: "User unblocked",
    user
  });
}
