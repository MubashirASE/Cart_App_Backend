import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const addCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({});
    if (!cart) {
      cart = new Cart({ items: [{ productId, quantity: 1 }] });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }
    }

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const fetchCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({}).populate("items.productId");
    if (!cart || cart.items.length === 0) return res.status(404).json({ message: "Cart is empty" });
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({});
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex === -1) return res.status(404).json({ message: "Item not found" });

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({});
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== productId
    );

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    console.log("cartId", cartId);
    const cartData = await Cart.findOne({});
    if (!cartData) return res.status(404).json({ message: "Cart not found" });

    const cart =await Cart.deleteOne({ _id: cartId });

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
