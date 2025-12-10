import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
export const isAuthentication = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("auth",authHeader)
  if (authHeader && authHeader.startsWith("Bearer ")) {

    const token = authHeader.split(" ")[1];
    console.log('token',token)
    try {
      const decoded = jwt.verify(token,process.env.SECRET_KEY);
      console.log("Decoded JWT:", decoded);
      req.userId = decoded.userId;
      console.log("userID :", req.userId);
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

      next();
    } catch (err) {
      console.log("JWT verification failed:", err);
      return res.status(401).send("Token invalid");
    }
  } else {
    return res.status(401).send("No token");
  }
};