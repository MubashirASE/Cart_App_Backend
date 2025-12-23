
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

      const html =generateOtpEmailTemplate(otp, name)

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

    const html =generateOtpEmailTemplate(otp, user.name)


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

export const generateOtpEmailTemplate = (otp, name) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>OTP Verification - GoCartify</title>
      <style>
          body { font-family: Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; padding: 30px; text-align: center; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { font-size: 24px; font-weight: bold; color: #1e3a8a; margin-bottom: 10px; }
          .subheader { font-size: 16px; margin-bottom: 20px; }
          .otp { display: inline-block; font-size: 32px; font-weight: bold; background-color: #e0f2fe; padding: 10px 20px; border-radius: 8px; letter-spacing: 4px; color: #0369a1; margin-bottom: 20px; }
          .footer { font-size: 14px; color: #6b7280; margin-top: 30px; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Hello ${name}</div>
          <div class="subheader">Welcome to <b>GoCartify</b>! Use the following OTP to verify your account:</div>
          <div class="otp">${otp}</div>
          <div class="subheader">This OTP is valid for 1 hour.</div>
          <div class="footer">If you did not request this, please ignore this email. <br/>© 2025 GoCartify</div>
      </div>
  </body>
  </html>
  `;
};

// export const Login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const data = await User.findOne({ email });

//     if (!data) {
//       return res.json({ success: false, message: "Invalid Email!" });
//     }

//     const isPassword = await bcrypt.compare(password, data.password);
//     if (!isPassword) {
//       return res.json({ success: false, message: "Incorrect Password!" });
//     }

//     if (!data.isVerified) {
//       const token = crypto.randomBytes(32).toString("hex");
//       data.verificationToken = token;
//       data.verificationTokenExpires = Date.now() + 1000 * 60 * 60;
//       await data.save();

//       const verifyUrl = `${process.env.BACKEND_URL}/api/user/verify/${token}`;
//       const html = `<h3>Verify your account </h3>
//                     <p>Click link to verify:</p>
//                     <a href="${verifyUrl}">${verifyUrl}</a>`;

//       await sendEmail({
//         to: email,
//         subject: "Verify your admin account",
//         html,
//       });

//       return res.json({
//         success: false,
//         message: "Please verify your email. A new verification link has been sent!",
//       });
//     }

//       const otp = Math.floor(100000 + Math.random() * 900000).toString();
//       data.verificationToken = otp;
//       data.verificationTokenExpires = Date.now() + 1000 * 60 * 15; 
//       await data.save();

//       const html = `<h3>Login Verification</h3>
//                     <p>Your login verification code is: <b>${otp}</b></p>`;
      
//       await sendEmail({ to: email, subject: "Login OTP", html });

//       return res.json({
//         success: true,
//         requireOtp: true,
//         message: "OTP sent to your email. Please verify to login.",
//       });


//   } catch (error) {
//     console.log(error);
//     return res.json({ success: false, message: "Login failed!" });
//   }
// };

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid Email! " });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ success: false, message: "Incorrect Password!" });
    }
    console.log("user",user)
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked. You cannot Access"
      });
    }
    return generateToken(res, user, ` ${user.name} Welcome Back!`); 

  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Login failed!" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isMatch) {
        return res.status(400).json({ message: "Current password incorrect" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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
  const userId = await User.findById(req.params.id);
  if (!userId) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  const user = await User.findByIdAndUpdate(
    userId._id,
    { isBlocked: true },
    { new: true }
  );

  res.json({
    success: true,
    message: "User blocked successfully!",
    user
  });
}
export const userUnBlocked=async (req, res) => {
  const userId = await User.findById(req.params.id);
  if (!userId) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  const user = await User.findByIdAndUpdate(
    userId._id,
    { isBlocked: false },
    { new: true }
  );

  res.json({
    success: true,
    message: "User unblocked successfully!",
    user
  });
}

export const adminSendMail=async (req, res) => {
  const userId = await User.findById(req.params.id);
  if (!userId) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isBlocked: false },
    { new: true }
  );
  const reason='Violation of GoCartify rules'
    const emailHtml = generateBlockEmailTemplate(user.name, reason);
    await sendEmail({
      to: user.email,
      subject: "Your GoCartify account has been blocked",
      html: emailHtml,
    });
    return res.json({ success: true, message: "User sent email successfully." });
}
export const generateBlockEmailTemplate = (userName, reason) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Account Blocked - GoCartify</title>
      <style>
          body { font-family: Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; padding: 30px; text-align: center; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { font-size: 24px; font-weight: bold; color: #dc2626; margin-bottom: 10px; }
          .subheader { font-size: 16px; margin-bottom: 20px; }
          .reason-box { background-color: #fee2e2; color: #b91c1c; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .footer { font-size: 14px; color: #6b7280; margin-top: 30px; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Hello ${userName},</div>
          <div class="subheader">We regret to inform you that your GoCartify account has been <b>blocked</b>.</div>
          <div class="reason-box">
              <strong>Reason:</strong> ${reason}
          </div>
          <div class="subheader">
              This action was taken because your account violated our rules and policies. 
              Please contact our support team if you think this was a mistake.
          </div>
          <div class="footer">© 2025 GoCartify. All rights reserved.</div>
      </div>
  </body>
  </html>
  `;
};
