
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

export const placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    const userId = req.user ? req.user._id : null;
    const guestId = req.guestId;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    if (!userId && !guestId) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const orderItems = [];

    for (let item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });
      }

      // deduct quantity
      product.quantity -= item.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }
    const paymentStatus = paymentMethod === "CARD" ? "Completed" : "Pending";

    const orderData = {
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      totalAmount,
    };

    if (userId) {
      orderData.user = userId;
    } else {
      orderData.guestId = guestId;
    }

    const order = await Order.create(orderData);

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
  .populate("items.product", "name price image")  // products ke liye
  .populate("user", "name email")                // user ke liye
  .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    console.log(status,req.params.id)

const order = await Order.findById(req.params.id)
  .populate("user", "name email")  // sirf name aur email la rahe hain
  .populate("items.product", "name price image"); // items ke product details
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.orderStatus = status;
    if (status === "delivered") {
      order.paymentStatus = "paid";
    }
    await order.save();

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// export const getOrderById = async (req, res) => {
//   try {
//   const { userId, guestId } = req.query;
//     // const order = await Order.findById(req.params.id)
//     //   .populate("user", "name email")
//     //   .populate("items.product", "name price image");
//         if (userId) {
//       orderData.user = userId;
//     } else {
//       orderData.guestId = guestId;
//     }

// const order = await Order.findById({ user: req.user._id }).sort({ createdAt: -1 });
//    console.log(order)
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }
//     if (req.user.role !== "admin" && order.user._id.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const getOrderById = async (req, res) => {
  try {
    const { userId, guestId } = req.query;

    let filter = {};
    if (userId) {
      filter.user = userId;
    } else if (guestId) {
      filter.guestId = guestId;
    } else {
      return res.status(400).json({ message: "No userId or guestId provided" });
    }
console.log(filter)
    // Fetch orders
    const orders = await Order.find(filter)
      .populate("user", "name email")
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 }); // newest f

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
