import express from "express";
import { getDashboardData } from "../controllers/dashboardController.js";

const router = express.Router();

router.post("/getanalytics", getDashboardData);

export { router as DashboardRouter };
