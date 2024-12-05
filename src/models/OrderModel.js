const OrderSchema = new mongoose.Schema({
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
      currency: { type: String, required: true }, // e.g., "USD", "EUR", "GHS"
    },
  ],
  totalAmount: { type: Number, required: true },
  currency: { type: String, required: true, default: "USD" }, // Default currency
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  orderStatus: {
    type: String,
    enum: ["processing", "shipped", "delivered", "cancelled"],
    default: "processing",
  },
  createdAt: { type: Date, default: Date.now },
});

const OrderModel = mongoose.model("Order", OrderSchema);
export default OrderModel;
