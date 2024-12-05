import UserModel from "../models/UserModel.js";

export async function checkIfUserExists(email, response) {
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      return response.status(400).json({ message: "User already exists" });
    }
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Server error" });
  }
}
