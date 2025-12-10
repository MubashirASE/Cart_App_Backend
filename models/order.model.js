import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "CARD"],
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
