import React from "react";
import AdminDashBoardClient from "./AdminDashBoardClient";
import connectDb from "@/lib/db";
import Order from "@/models/orderModel";
import User from "@/models/userModel";
import Grocery from "@/models/groceryModel";

const AdminDashBoard = async () => {
  await connectDb();
  const orders = await Order.find({});
  const user = await User.find({ role: "user" });
  const groceries = await Grocery.find({});

  const totalOrders = orders.length;
  const totalUsers = user.length;
  const pendingDeliveries = orders.filter((o) => o.status === "pending").length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const today = new Date();
  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);

  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt) >= startOfToday,
  );
  const todayRevenue = todayOrders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0,
  );

  const sevenDayOrders = orders.filter(
    (o) => new Date(o.createdAt) >= sevenDaysAgo,
  );
  const sevenDayRevenue = sevenDayOrders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0,
  );

  const stats = [
    { title: "Total Orders", value: totalOrders }, // ✅ fixed
    { title: "Total Customers", value: totalUsers },
    { title: "Pending Deliveries", value: pendingDeliveries },
    { title: "Total Revenue", value: totalRevenue },
  ];

  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const orderCount = orders.filter(
      (o) =>
        new Date(o.createdAt) >= date &&
        new Date(o.createdAt) < nextDay,
    );

    chartData.push({
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      orders: orderCount.length,
    });
  }

  return (
    <>
      <AdminDashBoardClient
        earning={{
          today: todayRevenue,
          sevenDay: sevenDayRevenue,
          total: totalRevenue,
        }}
        stats={stats}
        chartData={chartData}
      />
    </>
  );
};

export default AdminDashBoard;