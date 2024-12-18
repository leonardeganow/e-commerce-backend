import OrderModel from "../models/OrderModel.js";
import ProductModel from "../models/ProductModel.js";
import UserModel from "../models/UserModel.js";

export const getDashboardData = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    console.log(req.body);

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "startDate and endDate are required" });
    }

    //get total orders for the given date range
    const totalSales = await OrderModel.countDocuments({
      status: "completed",
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
          status: "completed",
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
