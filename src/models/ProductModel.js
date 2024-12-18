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
  image: { type: String, required: true },
  colors: [
    {
      type: String,
      required: true,
    },
  ],
  sizes: [
    {
      type: String,
      required: true,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const ProductModel = mongoose.model("Product", ProductSchema);
export default ProductModel;
