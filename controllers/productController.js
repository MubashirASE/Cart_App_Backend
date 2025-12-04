import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const { name, price ,quantity} = req.body;
    if (!name || !price || !req.file || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const image = `/uploads/${req.file.filename}`;
        console.log(name, price,quantity,image);

    const newProduct = new Product({ name, price, image ,quantity});
    await newProduct.save();

    res.json({ success: true, message: "Product created", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const fetchProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id, name, price, quantity } = req.body;
    const product = await Product.findById(id);
    
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (name) product.name = name;
    if (price) product.price = price;
    if (quantity) product.quantity = quantity;
    if (req.file) product.image = req.file.path;
  
    const updatedProduct = await product.save();
    console.log(updatedProduct);
    res.json({ success: true, message: "Product updated", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    await Product.deleteOne({ _id: id });
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
