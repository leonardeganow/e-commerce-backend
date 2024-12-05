import mongoose from "mongoose";


const CartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        color: { type: String, required: true },
        size: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }, 
        currency: { type: String, required: true }, 
      },
    ],
    createdAt: { type: Date, default: Date.now },
  });
  
  const CartModel = mongoose.model("Cart", CartSchema);
  export default CartModel;
  