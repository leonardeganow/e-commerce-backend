import uploadToCloudinary from "../libs/cloudinary.js";
import CategoryModel from "../models/CategoryModel.js";

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      stock,
      price,
      currency,
      featured,
      categoryId,
      image,
      sizes,
      colors,
    } = req.body;

    if (
      !name ||
      !description ||
      !stock ||
      !price ||
      !currency ||
      !featured ||
      !categoryId ||
      !image ||
      !sizes ||
      !colors
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const imageUrl = await uploadToCloudinary(image);

    const newProduct = new ProductModel({
      name,
      description,
      stock,
      price,
      currency,
      featured,
      category: category._id,
      image: imageUrl.url,
      sizes,
      colors,
    });
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Validate input
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Check if the category already exists by name
    const existingCategory = await CategoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Create and save a new category
    const newCategory = new CategoryModel({ name });
    await newCategory.save();

    res.status(201).json({
      message: "Category added successfully",
      category: newCategory,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

export { addProduct, addCategory };
