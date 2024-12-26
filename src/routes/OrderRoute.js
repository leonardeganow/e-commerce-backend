import express from "express";
import {
  createOrder,
  getAllOrders,
  getCustomerOrders,
  getCustomerRecentOrder,
  getSingleOrder,
  handleOrderStatusChange,
  handleRefund,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/createorder", createOrder);
router.get("/getorders", getAllOrders);
router.get("/getorders/:userid", getCustomerOrders);
router.get("/getrecentorder/:userid", getCustomerRecentOrder);
router.post("/changeorderstatus", handleOrderStatusChange);
router.post("/refundorder", handleRefund);
router.post("/getsingleorder", getSingleOrder);

export { router as OrderRouter };
