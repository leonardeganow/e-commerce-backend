import express from "express";
import {
  addCategory,
  addProduct,
  deleteCategory,
  deleteProduct,
  getAllProducts,
  getCategories,
  getFeaturedProducts,
  updateCategory,
  updateProduct,
} from "../controllers/productController.js";
import checkAuthToken from "../middlewares/checkAuthToken.js";

const router = express.Router();

// router.use(checkAuthToken);

router.post("/addproduct", addProduct);
router.post("/addcategory", addCategory);
router.get("/getcategories", getCategories);
router.put("/updatecategory", updateCategory);
router.delete("/deletecategory", deleteCategory);
router.put("/products/:productId", updateProduct);
router.delete("/products/:productId", deleteProduct);
router.get("/products/allproducts", getAllProducts);
router.get("/products/featuredproducts", getFeaturedProducts);
export { router as ProductRouter };
