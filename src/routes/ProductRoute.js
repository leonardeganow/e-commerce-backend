import express from "express";
import {
  addCategory,
  addProduct,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/addproduct", addProduct);
router.post("/addcategory", addCategory);
router.get("/getcategories", getCategories);
router.put("/updatecategory", updateCategory);
router.delete("/deletecategory", deleteCategory);

export { router as ProductRouter };
