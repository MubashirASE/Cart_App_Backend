import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const isAuthentication = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.userId = decoded.userId;
      
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      if (user.isBlocked) {
        return res.status(403).json({
          success: false,
          message: "Your account is blocked. You cannot Access"
        });
      }

      req.user = user;

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