import mongoose from "mongoose";
import {
  successfulOrderCreated,
  orderStatusEmail,
} from "../htmlTemplates/index.js";
import { transporter } from "../libs/nodemailer.js";
import CartModel from "../models/CartModel.js";
import OrderModel from "../models/OrderModel.js";
import UserModel from "../models/UserModel.js";
import ProductModel from "../models/ProductModel.js";

const createOrder = async (req, res) => {
  const session = await mongoose.startSession(); // Start a MongoDB session
  session.startTransaction(); // Start a transaction

  try {
    const {
      user,
      items,
      address,
      city,
      country,
      paymentReference,
      paymentStatus,
      totalAmount,
      phone,
    } = req.body;

    if (!user || !items) {
      return res
        .status(400)
        .json({ message: "User ID and Cart items are required" });
    }

    // Deduct stock for each item in the order
    for (const item of items) {
      const product = await ProductModel.findById(item.product).session(
        session
      );

      if (!product) {
        throw new Error(`Product with ID ${item.product} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for product ${product.name}. Only ${product.stock} left.`
        );
      }

      // Deduct stock
      product.stock -= item.quantity;
      await product.save({ session });
    }

    // Create the order
    const order = await OrderModel.create(
      [
        {
          user,
          items,
          totalAmount,
          contactNumber: phone,
          shippingAddress: address,
          city,
          country,
          paymentReference,
          paymentStatus,
        },
      ],
      { session }
    );

    // Populate the product in each item of the order
    const populatedOrder = await OrderModel.findById(order[0]._id)
      .populate("items.product")
      .session(session);

    // Clear cart after successful order creation
    await CartModel.findOneAndDelete({ user: user }).session(session);

    // Notify user via email
    const foundUser = await UserModel.findById(user).session(session);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: foundUser.email,
      subject: "Order created Successfully",
      html: successfulOrderCreated(foundUser.name, populatedOrder),
    });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return  res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    // Rollback transaction on failure
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating order:", error);
    return  res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({})
      .populate("user")
      .populate("items.product")
      .sort({ createdAt: -1 });
      return  res.status(200).json({ orders });
  } catch (error) {
    console.log(error);
    return  res.status(500).json({ message: "an error occurred", error });
  }
};

const getCustomerOrders = async (req, res) => {
  try {
    const { userid } = req.params;
    const orders = await OrderModel.find({ user: userid }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ orders });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "an error occurred", error });
  }
};

const getCustomerRecentOrder = async (req, res) => {
  try {
    const { userid } = req.params;
    const order = await OrderModel.findOne({ user: userid })
      .populate("items.product")
      .sort({ createdAt: -1 })
      .limit(1);
    return res.status(200).json({ order });
  } catch (error) {
    return res.status(500).json({ message: "an error occurred", error });
  }
};

const getRecentOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({})
      .populate("items.product")
      .populate("user")
      .sort({ createdAt: -1 })
      .limit(6);

    return res.status(200).json({ orders });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "an error occurred", error });
  }
};

const handleOrderStatusChange = async (req, res) => {
  try {
    const { orderId, orderStatus } = req.body;

    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );

    if (order) {
      //send email notification
      const foundOrder = await OrderModel.findById(orderId);
      const foundUser = await UserModel.findById(foundOrder.user);

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: foundUser.email,
        subject: "Order Status Changed",
        html: orderStatusEmail(foundUser.name, foundOrder),
      });
    }
    return res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "an error occurred", error });
  }
};

const handleRefund = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { orderId, refundAmount } = req.body;

    // Start a transaction
    //the transactions helps so that incase db update fails it rolls back all what it had previosuly done
    session.startTransaction();

    // Update the order status to "refunded" and record the total refund amount
    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { orderStatus: "refunded", paymentStatus: "refunded", refundAmount },
      { new: true, session }
    );

    if (!order) {
      throw new Error("Order not found");
    }

    for (let item of order.items) {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } },
        { new: true, session }
      );

      if (!updatedProduct) {
        throw new Error(`Product not found: ${item.product}`);
      }
    }

    // Commit the transaction
    await session.commitTransaction();

    // Respond to the client
    return res
      .status(200)
      .json({ message: "Refund processed successfully", order });
  } catch (error) {
    // Rollback the transaction in case of an error
    await session.abortTransaction();

    // Log and respond with the error
    console.error("Error processing refund:", error);
    return res
      .status(500)
      .json({ message: "Failed to process refund", error: error.message });
  } finally {
    // End the session
    session.endSession();
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const { orderId, userId } = req.body;
    //find user order by user
    if (userId && orderId) {
      const order = await OrderModel.findOne({ user: userId, _id: orderId })
        .populate("items.product")
        .populate("user");
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.status(200).json({ order });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred", error });
  }
};

export {
  createOrder,
  getAllOrders,
  getCustomerOrders,
  getCustomerRecentOrder,
  getRecentOrders,
  handleOrderStatusChange,
  handleRefund,
  getSingleOrder,
};
