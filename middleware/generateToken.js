import jwt from "jsonwebtoken";

export const generateToken = (res, user,message) => {
  const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
   const userData={
        id :user.id,
        name:user.name,
        email:user.email,
        role:user.role,
        isBlocked:user.isBlocked,
        isVerified:user.isVerified
    }
  return res
    .status(200).json({
        success:true,
        message,
        token,
        userData
    });
};