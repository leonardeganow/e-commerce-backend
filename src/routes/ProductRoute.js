import express from "express";
import {
  addCategory,
  addProduct,
  deleteCategory,
  deleteProduct,
  firstTenProducts,
  getAllProducts,
  getCategories,
  getFeaturedProducts,
  getLatestProducts,
  getProductById,
  getProductsByCategory,
  getRelatedProducts,
  updateCategory,
  updateProduct,
} from "../controllers/productController.js";
import checkAuthToken from "../middlewares/checkAuthToken.js";

const router = express.Router();

// router.use(checkAuthToken);

router.post("/addproduct", addProduct);
router.post("/addcategory", addCategory);
router.get("/getcategories", getCategories);
router.get("/products/newarrivals", getLatestProducts);
router.put("/updatecategory", updateCategory);
router.delete("/deletecategory", deleteCategory);
router.put("/products/:productId", updateProduct);
router.delete("/products/:productId", deleteProduct);
router.get("/products/allproducts", getAllProducts);
router.get("/products/featuredproducts", getFeaturedProducts);
router.get("/products/tenproducts", firstTenProducts);
router.get("/products/:productid", getProductById);
router.get("/relatedproducts/:productId", getRelatedProducts);
router.get("/productsbycategory/:categoryId", getProductsByCategory);
export { router as ProductRouter };
