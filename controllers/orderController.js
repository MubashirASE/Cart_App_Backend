import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(req.body)
    const { paymentMethod , totalAmount} = req.body;

    const cart = await Cart.findOne({ user: userId }).populate("items.productId");

    if (!cart) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const newOrder = await Order.create({
      user: userId,
      items: cart.items,
      totalAmount,
      paymentMethod 
    });

    await Cart.findOneAndDelete({ user: userId });

    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
