import UserModel from "../models/UserModel.js";
import AdminModel from "../models/AdminModel.js";

// Helper function to hash password
export const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

// Helper function to check if user already exists
export const checkIfUserExists = async (email) => {
  return UserModel.findOne({ email });
};

// Helper function to check if admin already exists
export const checkIfAdminExists = async () => {
  return AdminModel.findOne({ role: "admin" });
};

// Helper function to create a new user
export const createNewUser = async (userData) => {
  const newUser = new UserModel(userData);
  return newUser.save();
};

// Helper function to create a new admin
export const createNewAdmin = async (adminData) => {
  const newAdmin = new AdminModel(adminData);
  return newAdmin.save();
};
