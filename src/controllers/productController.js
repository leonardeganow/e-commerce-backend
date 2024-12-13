import uploadToCloudinary, {
  deleteImageFromCloudinary,
} from "../libs/cloudinary.js";
import CategoryModel from "../models/CategoryModel.js";
import ProductModel from "../models/ProductModel.js";

const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({});
    const categories = await CategoryModel.find({});

    const productsWithCategoryNames = products.map((products) => {
      const category = categories.find(
        (category) => category?._id?.toString() === products.category.toString()
      );
      return { ...products.toJSON(), categoryName: category?.name };
    });

    return res.status(200).json({ productsWithCategoryNames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await ProductModel.find({ featured: true });
    return res.status(200).json({ featuredProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const firstTenProducts = async (req, res) => {
  try {
    const firstTenProducts = await ProductModel.find({ featured: false }).limit(
      10
    );
    return res.status(200).json({ firstTenProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { productid } = req.params;

    const product = await ProductModel.findById(productid);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

    if (!name || !stock || !price || !currency || !categoryId || !image) {
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
      image: imageUrl,
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

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updates = req.body;

    // Check if the product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image.includes("https://")) {
      Object.assign(product, updates);
      await product.save();

      res.status(200).json({
        message: "Product updated successfully",
        product,
      });
    } else {
      const imageUrl = await uploadToCloudinary(updates.image);
      if (!imageUrl || !imageUrl.url) {
        return res.status(500).json({ message: "Image upload failed" });
      }
      updates.image = imageUrl.url;
      // Update the product
      Object.assign(product, updates);
      await product.save();

      res.status(200).json({
        message: "Product updated successfully",
        product,
      });
    }
  } catch (error) {
    console.error("Error updating product:", error.message || error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if the product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete the image from cloudinary
    await deleteImageFromCloudinary(product.image);

    // Delete the product
    await ProductModel.findByIdAndDelete(productId);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error.message || error);
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
    const categories = await CategoryModel.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "products",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          productsCount: { $size: "$products" },
          productsStock: { $sum: "$products.stock" },
        },
      },
    ]);
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

const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const products = await ProductModel.find({ category: categoryId });
    if (!products) {
      return res.status(404).json({ message: "Products not found" });
    }


    return res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  addProduct,
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getFeaturedProducts,
  firstTenProducts,
  getProductById,
  getProductsByCategory,
};
