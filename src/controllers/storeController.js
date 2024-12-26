import uploadToCloudinary from "../libs/cloudinary.js";
import AdminModel from "../models/AdminModel.js";
import StoreModel from "../models/StoreModel.js";

const updatenameAndImage = async (req, res) => {
  try {
    const { adminId, name, image } = req.body;

    if (!adminId || !name || !image) {
      return res.status(400).json({
        message: "Admin ID, Store Name, and Store Image are required",
      });
    }

    const admin = await AdminModel.findOne({ _id: adminId });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Upload image to Cloudinary
    const imageUrl = await uploadToCloudinary(image);

    // Check if the admin already has a store
    const existingStore = await StoreModel.findOne({ adminId });

    if (existingStore) {
      // Update the existing store
      existingStore.name = name;
      existingStore.image = imageUrl;

      await existingStore.save();
      return res.status(200).json({ message: "Store updated successfully" });
    }

    // Create a new store
    const newStore = new StoreModel({
      adminId,
      name: name,
      image: imageUrl,
    });

    await newStore.save();

    res.status(200).json({ message: "Store created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getStoreNameAndImage = async (req, res) => {
  try {
    const store = await StoreModel.find();

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    return res.status(200).json({ store });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { updatenameAndImage, getStoreNameAndImage };
