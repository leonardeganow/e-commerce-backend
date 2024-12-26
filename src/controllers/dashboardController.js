import OrderModel from "../models/OrderModel.js";
import ProductModel from "../models/ProductModel.js";
import UserModel from "../models/UserModel.js";

export const getDashboardData = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "startDate and endDate are required" });
    }

    //get total orders for the given date range
    const totalSales = await OrderModel.countDocuments({
      paymentStatus: "success",
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    //get total users for given date range
    const totalUsers = await UserModel.countDocuments({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    //get total revenue for the given date range
    const totalRevenue = await OrderModel.aggregate([
      {
        $match: {
          paymentStatus: "success",
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: { _id: null, total: { $sum: "$totalAmount" } },
      },
    ]);

    //get total products
    const totalProducts = await ProductModel.countDocuments({});

    return res.status(200).json({
      totalSales,
      totalUsers,
      totalRevenue: totalRevenue[0] ? totalRevenue[0].total : 0,
      totalProducts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};

export const salesOverview = async (req, res) => {
  try {
    const { year } = req.body;

    const salesData = [];

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const orders = await OrderModel.find({
        orderStatus: "processing",
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      });

      const totalSales = orders.reduce(
        (total, order) => total + order.totalAmount,
        0
      );

      salesData.push({
        name: months[month - 1], // Add month name
        total: totalSales,
      });
    }

    return res.status(200).json({ salesData });

    // return salesData;
  } catch (error) {
    return res.status(500).json({ message: error.message });
    // throw new Error('Failed to fetch sales data');
  }
};
export const userSignups = async (req, res) => {
  try {
    const { year } = req.body;

    const userSignupsData = [];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      // Find all users who signed up within the month
      const users = await UserModel.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      });

      // Add the month and total signups to the result
      userSignupsData.push({
        name: months[month - 1],
        total: users.length,
      });
    }

    return res.status(200).json({ userSignupsData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
