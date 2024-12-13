import express from "express";
import {
  addToCart,
  fetchCartWithDetails,
  removeFromCart,
  updateCartQuantity,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/addtocart", addToCart);
router.get("/getcart/:userid", fetchCartWithDetails);
router.delete("/removefromcart", removeFromCart);
router.put("/updatecartquantity", updateCartQuantity);

export { router as CartRouter };
