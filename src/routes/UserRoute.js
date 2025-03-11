import express from "express";
import {
  changePassword,
  forgotPassword,
  loginUser,
  refreshToken,
  registerUser,
  resetPassword,  
  updateUserInfo,
} from "../controllers/authController.js";
import multer from "multer";
import { getStoreNameAndImage, updatenameAndImage } from "../controllers/storeController.js";

const router = express.Router();

// Set up multer to handle file uploads
const upload = multer({ storage: multer.memoryStorage() });

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/changepassword", changePassword);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);
router.post("/updateprofile", updateUserInfo);
router.post("/storesettings", updatenameAndImage);
router.get("/storeinfo", getStoreNameAndImage);

export { router as AuthRouter };
