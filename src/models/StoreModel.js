//store model;

import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const StoreModel = mongoose.model("Store", storeSchema);

export default StoreModel;
