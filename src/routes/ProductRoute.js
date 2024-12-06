import express from "express";
import { addCategory, addProduct } from "../controllers/productController.js";

const router = express.Router();

router.post("/addproduct", addProduct);
router.post("/addcategory", addCategory);

export { router as ProductRouter };
