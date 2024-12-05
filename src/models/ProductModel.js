import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  currency: { type: String, required: true, default: "GHS" },
  stock: { type: Number, required: true },
  featured: { type: Boolean, default: false },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  image: { type: String },
  colors: [
    {
      name: { type: String, required: true },
      hexCode: { type: String, required: true },
    },
  ],
  sizes: [
    {
      name: { type: String, required: true },
      stock: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const ProductModel = mongoose.model("Product", ProductSchema);
export default ProductModel;
