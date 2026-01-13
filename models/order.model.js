
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    guestId: {
      type: String,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    shippingAddress: {
      fullName: { type: String, required: true },
            lastName: { type: String },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: String,
      country: { type: String, default: "Pakistan" },
    },

    paymentMethod: {
      type: String,
      enum: ["CARD", "COD"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    orderStatus: {
      type: String,
      enum:["Pending","In progress","In transited","Delivered"],
      default: "Pending", 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
