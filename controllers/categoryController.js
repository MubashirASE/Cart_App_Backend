import Category from "../models/category.model.js";
import Product from "../models/product.model.js";

export const createCategory = async (req, res) => {
  try {
    const { name, parent } = req.body;
    console.log("req.body",req.body)
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    let parentId = null;
    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res.status(404).json({ message: "Parent category not found" });
      }
      parentId = parentCategory._id;
    }
        if (!req.file) {
      return res.status(400).json({ message: "Category image is required" });
    }
    const storedImagePath = `/uploads/${req.file.filename}`;

    const slug = name.toLowerCase().trim().replace(/\s+/g, "-");

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Category with this name already exists" });
    }
    
    const newCategory = new Category({
      name,
      slug,
      parent: parentId,
      image: req.file.path,
      isActive: true,
    });

    const savedCategory = await newCategory.save();

    return res.status(201).json({
      message: "Category created successfully",
      category: savedCategory,
    });
  } catch (error) {
    console.error("Create Category Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, parent, isActive } = req.body;
    const { id } = req.params;
    const updateData = {};

    if (name) {
      updateData.name = name;
      updateData.slug = name.toLowerCase().trim().replace(/\s+/g, "-");

      const existingCategory = await Category.findOne({
        slug: updateData.slug,
        _id: { $ne: id },
      });
      if (existingCategory) {
        return res
          .status(400)
          .json({ message: "Category with this name already exists" });
      }
    }
   
    if (parent !== undefined) {
      if (parent) {
        const parentCategory = await Category.findById(parent);
        if (!parentCategory) {
          return res.status(404).json({ message: "Parent category not found" });
        }
        if (parent === id) {
          return res
            .status(400)
            .json({ message: "Category cannot be its own parent" });
        }
        updateData.parent = parentCategory._id;
      } else {
        updateData.parent = null;
      }
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }
if (req.file) {
  updateData.image = req.file.path;
}

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("parent", "name");

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Update Category Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const disableCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    let updatedCategory;

    if (category.isActive) {
      updatedCategory = await Category.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!category.parent) {
        await Category.updateMany(
          { parent: category._id },
          { isActive: false }
        );
      }

      return res.status(200).json({
        message: "Category disabled successfully",
        category: updatedCategory,
      });
    }

          updatedCategory = await Category.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    return res.status(200).json({
      message: "Category enabled successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Disable Category Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const childCategories = await Category.find({ parent: id });
    if (childCategories.length > 0) {
      return res.status(400).json({
        message:
          "Cannot delete category with subcategories. Please delete or reassign subcategories first.",
      });
    }

    const productsCount = await Product.countDocuments({ category: id });
    if (productsCount > 0) {
      return res.status(400).json({
        message: `Cannot delete category with ${productsCount} product(s). Please reassign or delete products first.`,
      });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete Category Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.find(  )
      .populate("parent", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Get All Categories Admin Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
export const getAllCategoriesUser = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate("parent", "name" )
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Get All Categories Admin Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate("parent", "name")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Get Active Categories Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id).populate("parent", "name");

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subcategories = await Category.find({
      parent: id,
      isActive: true,
    });

    return res.status(200).json({
      success: true,
      category,
      subcategories,
    });
  } catch (error) {
    console.error("Get Category By ID Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getCategoryWithProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (!category.isActive) {
      return res.status(404).json({ message: "Category not available" });
    }

    const products = await Product.find({ category: id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      category,
      productsCount: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Category With Products Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getChildCategories = async (req, res) => {
  try {
    const { parentId } = req.params;
    console.log("parentId",parentId)
const children = await Category.find({ parent: parentId, isActive: true }).populate("parent", "name");
    console.log("children",children)
    res.status(200).json({ success: true, children });
  } catch (err) {
    console.error("Get Child Categories Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}
