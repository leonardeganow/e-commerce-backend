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

    return res.status(201).json({
      message: "Category added successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    return res.status(200).json({
      data: categories,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id, name } = req.body;
    if (!id || !name) {
      return res.status(400).json({ message: "id and name is required" });
    }

    const categoryToUpdate = await CategoryModel.findById({ _id: id });
    if (!categoryToUpdate) {
      return res.status(400).json({ message: "could not find category" });
    }

    categoryToUpdate.name = name;

    await categoryToUpdate.save();

    return res.status(201).json({
      message: "category updated successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "id  is required" });
    }

    const categoryToDelete = await CategoryModel.findByIdAndDelete({ _id: id });
    if (!categoryToDelete) {
      return res.status(400).json({ message: "could not find category" });
    }

    return res.status(201).json({
      message: "category deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

export {
  addProduct,
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
