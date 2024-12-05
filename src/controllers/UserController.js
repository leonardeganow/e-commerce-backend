import { checkIfUserExists } from "../helpers/index.js";
import bcrypt from "bcrypt";
import UserModel from "../models/UserModel.js";
import { registerUserValidation } from "../validations/userValidation.js";

const registerUser = async (request, response) => {
  try {
    // Validate incoming data
    const { error, value } = registerUserValidation.validate(request.body);

    if (error) {
      return response.status(400).json({ message: error.details[0].message });
    }

    // Destructure validated data
    const { name, address, contactNumber, email, password, type } = value;

    await checkIfUserExists(email,response);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      address,
      contactNumber,
      email,
      password: hashedPassword,
      type,
    });

    await newUser.save();

    // Respond with user details and token
    response.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        type: newUser.type,
      },
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
};

export { registerUser };
