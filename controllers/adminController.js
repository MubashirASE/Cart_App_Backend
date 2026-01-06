import { generateToken } from "../middleware/generateToken.js";
import { Admin } from "../models/admin.model.js";
import bcrypt from "bcryptjs";

export const adminSignUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields are required!" });
    }

    const adminData = await Admin.findOne({ email });
    if (adminData) return res.json({ success: false, message: "Email already exists!" });

    const hashPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashPassword,
      role: role || "admin",
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.json({ success: false, message: "Invalid Email!" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.json({ success: false, message: "Incorrect Password!" });
    }

    if (admin.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked. You cannot Access",
      });
    }

    return generateToken(res, admin, `${admin.name} Welcome Back!`);
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Login failed!" });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email, currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(userId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (name) admin.name = name;
    if (email) admin.email = email;

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, admin.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Current password incorrect" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedPassword;
    }

    await admin.save();

    res.json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const adminData = await Admin.find().select("-password");
    return res.json({
      success: true,
      data: adminData,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Admin Data failed!",
    });
  }
};

export const adminBlocked = async (req, res) => {
  const adminId = await Admin.findById(req.params.id);
  if (!adminId) {
    return res.status(404).json({ success: false, message: "Admin not found" });
  }
  const admin = await Admin.findByIdAndUpdate(
    adminId._id,
    { isBlocked: true },
    { new: true }
  );

  res.json({
    success: true,
    message: "Admin blocked successfully!",
    admin,
  });
};

export const adminUnBlocked = async (req, res) => {
  const adminId = await Admin.findById(req.params.id);
  if (!adminId) {
    return res.status(404).json({ success: false, message: "Admin not found" });
  }
  const admin = await Admin.findByIdAndUpdate(
    adminId._id,
    { isBlocked: false },
    { new: true }
  );

  res.json({
    success: true,
    message: "Admin unblocked successfully!",
    admin,
  });
};
