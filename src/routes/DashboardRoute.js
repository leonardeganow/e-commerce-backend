import express from "express";
import {
  getDashboardData,
  salesOverview,
  userSignups,
} from "../controllers/dashboardController.js";
import { getRecentOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/getanalytics", getDashboardData);
router.post("/salesoverview", salesOverview);
router.post("/usersignups", userSignups);
router.get("/getrecentorders", getRecentOrders);

export { router as DashboardRouter };
