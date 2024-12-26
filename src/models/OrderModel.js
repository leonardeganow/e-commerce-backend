import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        color: { type: String, required: true },
        size: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        currency: { type: String, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    refundAmount: { type: Number },
    shippingAddress: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    contactNumber: { type: String, required: true },
    paymentReference: { type: String, required: true },
    currency: { type: String, required: true, default: "GHS" },
    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed","refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled",'refunded'],
      default: "processing",
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("Order", OrderSchema);
export default OrderModel;
