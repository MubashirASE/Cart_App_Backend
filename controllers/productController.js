import Product from "../models/product.model.js";


export const createProduct = async (req, res) => {
  try {
    console.log("file name",req.file.path)
    const { name, price, quantity, serial_number , category} = req.body;
    const userId = req.userId;

    if (!name || !price || !quantity || !serial_number || !category) {
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
    console.log("storedImagePath",req.file)
    const newProduct = await Product.create({
      name,
      price,
      quantity,
      serial_number,
      category,
      image: req.file.path,
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
      .populate("user", "name email")
      .populate("category", "name slug");

    return res.json(products);

  } catch (error) {
    console.error("FETCH PRODUCTS ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const fetchProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    console.log("categoryId",categoryId)
    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const products = await Product.find({ category: categoryId })
      .populate("user", "name email")
      .populate("category");
    console.log("products",products)
    return res.json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {
    console.error("FETCH PRODUCTS BY CATEGORY ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const filterProductsByCategory = async (req, res) => {
  try {
    const { categoryIds } = req.body;
    console.log("categoryIds",categoryIds)
    if (!categoryIds || categoryIds.length === 0) {
      return res.status(400).json({ message: "Category IDs are required" });
    }

    const products = await Product.find({ category: { $in: categoryIds } })
      .populate("user", "name email")
      .populate("category");

    return res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err) {
    console.error("FILTER PRODUCTS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export const updateProduct = async (req, res) => {
  try {
    const userId = req.userId;
    const { id, name, price, quantity, serial_number, category } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(id).populate("user");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.user._id.toString() !== userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized user cannot update this product" });
    }

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (quantity !== undefined) product.quantity = quantity;
    if (serial_number !== undefined) product.serial_number = serial_number;
    if (category !== undefined) product.category = category;

    if (req.file) {
      product.image = req.file.path;
    }

    const updatedProduct = await product.save();

    return res.status(200).json({
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
    console.log("data",userId);
    const products = await Product.find({ user: userId })
      .populate("category", "name slug");

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
