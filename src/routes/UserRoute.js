import express from "express";
import {
  forgotPassword,
  loginUser,
  refreshToken,
  registerUser,
  resetPassword,
  updateUserInfo,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);
router.post("/updateprofile", updateUserInfo);

export { router as AuthRouter };
