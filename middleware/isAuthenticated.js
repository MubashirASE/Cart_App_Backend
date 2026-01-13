import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.userId = decoded.userId;
      
      const user = await User.findById(req.userId);
      console.log("user>>>>>>>",user)
      if (!user) {
        return res.status(403).json({ success: false, message: "User not found" });
      }

      if (user.isBlocked) {
        return res.status(403).json({
          success: false,
          message: "Your account is blocked. You cannot Access"
        });
      }

      req.user = user;
console.log("req.user",req.user)
      next();
    } catch (err) {
      console.log("JWT verification failed:", err);
      return res.status(401).json({ success: false, message: "Session expired. Please login again" });
    }
  } else {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
};

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
       return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not allowed to access this resource`,
      });
    }
    next();
  };
};

export const checkAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.userId = decoded.userId;
      
      const user = await User.findById(req.userId);
      if (user && !user.isBlocked) {
          req.user = user;
      }
    } catch (err) {
      console.log("JWT optional verification failed:", err);
      // Don't error out, just continue as guest
    }
  }
  // Try to get guestId from headers if no user found
  if (!req.userId) {
      const guestId = req.headers['x-guest-id'] || req.body.guestId || req.query.guestId;
      if(guestId){
          req.guestId = guestId;
      }
  }
  next();
};