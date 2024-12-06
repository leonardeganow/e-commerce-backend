import bcrypt from "bcrypt";
import UserModel from "../models/UserModel.js";
import {
  forgotPasswordValidation,
  loginUserValidation,
  registerUserValidation,
  resetPasswordValidation,
} from "../validations/userValidation.js";
import jwt from "jsonwebtoken";
import { transporter } from "../libs/nodemailer.js";
import {
  forgotPasswordTemplate,
  resetPasswordTemplate,
} from "../htmlTemplates/index.js";
import AdminModel from "../models/AdminModel.js";
import { adminValidationSchema } from "../validations/adminUserValidation.js";
import {
  checkIfAdminExists,
  checkIfUserExists,
  createNewAdmin,
  hashPassword,
} from "../helpers/index.js";

const registerUser = async (request, response) => {
  try {
    const userRole = request.body.role;
    if (!["customer", "admin"].includes(userRole)) {
      return response
        .status(400)
        .json({ message: "Invalid role. Must be 'customer' or 'admin'." });
    }

    if (userRole === "customer") {
      const { error, value } = registerUserValidation.validate(request.body);

      // Destructure validated data
      const { name, address, contactNumber, email, password, role } = value;

      if (error) {
        return response.status(400).json({ message: error.details[0].message });
      }

      // Check if user exists
      const existingUser = checkIfUserExists(email);
      if (existingUser) {
        return response.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Prepare user data
      userData = {
        name,
        address,
        contactNumber,
        email,
        password: hashedPassword,
        role,
      };

      const newUser = await createNewUser(userData);

      // Respond with user details
      return response.status(201).json({
        message: "User registered successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          type: newUser.type,
        },
      });
    } else if (userRole === "admin") {
      const { error, value } = adminValidationSchema.validate(request.body);

      if (error) {
        return response.status(400).json({ message: error.details[0].message });
      }

      const { name, email, password } = value;

      // Check if admin already exists
      const existingAdmin = await checkIfAdminExists();
      if (existingAdmin) {
        return response.status(403).json({ message: "Admin already exists." });
      }

      const hashedPassword = await hashPassword(password);

      // Prepare admin data
      userData = {
        name,
        email,
        password: hashedPassword,
        role: "admin",
      };

      const newAdmin = await createNewAdmin(userData);

      return response.status(201).json({
        message: "Admin registered successfully",
        admin: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
        },
      });
    }
  } catch (error) {
    // Handle specific "user exists" error
    if (error.message === "User already exists") {
      return response.status(400).json({ message: error.message });
    }

    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (request, response) => {
  try {
    const { error, value } = loginUserValidation.validate(request.body);


    if (error) {
      return response.status(400).json({ message: error.details[0].message });
    }
    const { email, password, role } = value;

    if (role === "customer") {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return response.status(401).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return response.status(401).json({ message: "Invalid credentials" });
      }

      //generate token
      const token = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const refreshToken = jwt.sign(
        {
          user,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      // Assigning refresh token in http-only cookie
      response.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      return response.json({
        message: "Logged in successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          address: user.address,
          contactNumber: user.contactNumber,
          type: user.type,
        },
        accessToken: token,
      });
    } else if (role === "admin") {
      const user = await AdminModel.findOne({ email });
      if (!user) {
        return response.status(401).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return response.status(401).json({ message: "Invalid credentials" });
      }

      //generate token
      const token = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const refreshToken = jwt.sign(
        {
          user,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      // Assigning refresh token in http-only cookie
      response.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      return response.json({
        message: "Logged in successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        accessToken: token,
      });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const data = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!data) {
      return res.status(401).json({ message: "unauthorized" });
    }

    //generate new token
    const token = jwt.sign({ user: data.user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({
      message: "Logged in successfully",
      accessToken: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { error, value } = forgotPasswordValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email } = value;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    // Generate a token
    const resetToken = jwt.sign({ email }, process.env.RESET_TOKEN_SECRET, {
      expiresIn: "10m",
    });
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send email with reset link
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,

      subject: "Password Reset",
      html: forgotPasswordTemplate(user.name, resetUrl),
    });

    res.json({ message: "Password reset link sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { error, value } = resetPasswordValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { email, newPassword } = value;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    // Send confirmation email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Successful",
        html: resetPasswordTemplate(user.name),
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
    }
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { registerUser, loginUser, refreshToken, forgotPassword, resetPassword };
