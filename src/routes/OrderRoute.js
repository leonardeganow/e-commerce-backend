import express from "express";
import {
  createOrder,
  getAllOrders,
  getCustomerOrders,
  getCustomerRecentOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/createorder", createOrder);
router.get("/getorders", getAllOrders);
router.get("/getorders/:userid", getCustomerOrders);
router.get("/getrecentorder/:userid", getCustomerRecentOrder);

export { router as OrderRouter };
