import { checkPrimeSync } from "crypto";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";


export const addCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;
    const guestId = req.guestId;

    if (!userId && !guestId) {
        return res.status(400).json({ message: "User ID or Guest ID required" });
    }

    const product = await Product.findById(productId).populate("user")                
    console.log("product",product)
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    let query = userId ? { user: userId } : { guestId: guestId };
    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = new Cart({
        ...query,
        items: [{ productId, quantity: 1 }],
      });
    } else {
      const index = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (index > -1) {
        cart.items[index].quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }
    }

    await cart.save();
    res.status(200).json({ success: true, cart , message: "Product added to cart" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const fetchCart = async (req, res) => {
  try {
    const userId = req.userId;
    const guestId = req.guestId;

    if (!userId && !guestId) {
        return res.status(400).json({ message: "User ID or Guest ID required" });
    }

    let query = userId ? { user: userId } : { guestId: guestId };
    const cart = await Cart.findOne(query).populate("items.productId");
    console.log("cart",cart)
    if (!cart || cart.items.length === 0)
      return res.status(404).json({ message: "Cart is empty" });

    res.status(200).json({ success: true, cart });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const allfetchCart = async (req, res) => {
  try {

    const cart = await Cart.find().populate("items.productId");

    if (!cart || cart?.items?.length === 0)
      return res.status(404).json({ message: "Cart is empty" });
    res.status(200).json({ success: true, cart });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.id; 
    const userId = req.userId;
    const guestId = req.guestId;

    if (!userId && !guestId) {
        return res.status(400).json({ message: "User ID or Guest ID required" });
    }

    console.log("quantity", quantity);
    console.log("productId", productId);

    let query = userId ? { user: userId } : { guestId: guestId };
    const cart = await Cart.findOne(query);
    if (!cart)
      return res.status(404).json({ message: "Cart not found" });

    const index = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (index === -1)
      return res.status(404).json({ message: "Item not found" });

    cart.items[index].quantity = quantity;

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
    const userId = req.userId;
    const guestId = req.guestId;

    if (!userId && !guestId) {
        return res.status(400).json({ message: "User ID or Guest ID required" });
    }

    console.log("productId",productId)
    let query = userId ? { user: userId } : { guestId: guestId };
    const cart = await Cart.findOne(query);
    if (!cart)
      return res.status(404).json({ message: "Cart not found" });
    console.log("cart",cart)
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
    const userId = req.userId;
    const guestId = req.guestId;
    
    let query = userId ? { user: userId } : { guestId: guestId };
    await Cart.deleteOne(query);
    res.status(200).json({ success: true, message: "Cart deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

