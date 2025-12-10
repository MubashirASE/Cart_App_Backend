import Product from "../models/product.model.js";


export const createProduct = async (req, res) => {
  try {
    const { name, price, quantity, serial_number } = req.body;
    const userId = req.userId;

    if (!name || !price || !quantity || !serial_number) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    const exists = await Product.findOne({ serial_number });
    if (exists) {
      return res.status(400).json({ message: "Serial number already exists" });
    }

    const storedImagePath = `/uploads/${req.file.filename}`;

    const newProduct = await Product.create({
      name,
      price,
      quantity,
      serial_number,
      image: storedImagePath,
      user: userId,
    });

    return res.json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });

  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const fetchProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("user", "name email");

    return res.json(products);

  } catch (error) {
    console.error("FETCH PRODUCTS ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const userId = req.userId;
    const { id, name, price, quantity, serial_number } = req.body;
    console.log()
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(id).populate("user")
    console.log("product",product)

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.user._id.toString() !== userId) {
      return res.status(401).json({ message: "Unauthorized user cannot update this product" });
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (quantity) product.quantity = quantity;
    if (serial_number) product.serial_number = serial_number;

    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await product.save();

    return res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });

  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.deleteOne({ _id: id });

    return res.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const fetchProductsByUser = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("data>>>>>>>",userId);
    const products = await Product.find({ user: userId });

    return res.json({
      success: true,
      total: products.length,
      products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
