import { successfulOrderCreated } from "../htmlTemplates/index.js";
import { transporter } from "../libs/nodemailer.js";
import CartModel from "../models/CartModel.js";
import OrderModel from "../models/OrderModel.js";
import UserModel from "../models/UserModel.js";

const createOrder = async (req, res) => {
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

    const order = await OrderModel.create({
      user: user,
      items: items,
      totalAmount: totalAmount,
      contactNumber: phone,
      shippingAddress: address,
      city: city,
      country: country,
      paymentReference: paymentReference,
      paymentStatus: paymentStatus,
    });

    //clear cart  after successfful order creation
    await CartModel.findOneAndDelete({ user: user });

    const foundUser = await UserModel.findOne({ _id: user });

    const recentOrder = await OrderModel.findOne({ user: user })
      .populate("items.product")
      .sort({ createdAt: -1 })
      .limit(1);

    //send email notification
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: foundUser.email,
      subject: "Order created Successfully",
      html: successfulOrderCreated(foundUser.name, recentOrder),
    });

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error occurred", error });
  }
};

const getAllOrders = async (req, res) => {
  try {
    console.log("hi");

    const orders = await OrderModel.find({}).populate("user");
    res.status(200).json({ orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error occurred", error });
  }
};

const getCustomerOrders = async (req, res) => {
  try {
    const { userid } = req.params;
    const orders = await OrderModel.find({ user: userid });
    res.status(200).json({ orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error occurred", error });
  }
};

const getCustomerRecentOrder = async (req, res) => {
  try {
    const { userid } = req.params;
    const order = await OrderModel.findOne({ user: userid })
      .populate("items.product")
      .sort({ createdAt: -1 })
      .limit(1);
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "an error occurred", error });
  }
};

export { createOrder, getAllOrders, getCustomerOrders, getCustomerRecentOrder };
