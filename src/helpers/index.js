import UserModel from "../models/UserModel.js";

export async function checkIfUserExists(email) {
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      throw new Error("User already exists");
    }
  } catch (error) {
    throw new Error(error.message || "Server error");
  }
}
