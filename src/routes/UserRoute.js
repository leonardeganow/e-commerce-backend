import express from "express";
import {
  forgotPassword,
  loginUser,
  refreshToken,
  registerUser,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);

export { router as AuthRouter };
