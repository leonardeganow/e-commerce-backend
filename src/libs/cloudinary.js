import { v2 as cloudinary } from "cloudinary";
import { getIdFromCloudinaryUrl } from "../utils/index.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (base64) => {
  try {
    if (!base64) {
      throw new Error("Image data is missing");
    }

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64, {
      folder: "shoe-box-products", // Optional: specify a folder
    });

    // The URL of the uploaded image
    const imageUrl = uploadResponse.secure_url;

    return imageUrl;
  } catch (error) {
    console.log(error);
  }
};

export default uploadToCloudinary;

// Function to delete an image
export const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    const imageId = getIdFromCloudinaryUrl(imageUrl);

    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(imageId, (error, result) => {
        if (error) {
          // console.error("Error deleting image from Cloudinary:", error);
          reject(error); // Reject the promise if an error occurs
        } else {
          // console.log("Image deletion result:", result);
          resolve(result); // Resolve the promise if successful
        }
      });
    });
  } catch (error) {
    // console.error("Error processing image URL:", error);
    throw error; // Ensure the error is propagated
  }
};
