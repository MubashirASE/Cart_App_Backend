import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
  },
  guestId: {
      type: String
  },
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);
