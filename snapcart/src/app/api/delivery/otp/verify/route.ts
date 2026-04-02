import connectDb from "@/lib/db";
import emitEvenHandler from "@/lib/emitEvenHandler";
import DeliveryAssignment from "@/models/deliveryAssignmentModel";
import Order from "@/models/orderModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { orderId, otp } = await req.json();
    if (!orderId || !otp) {
      return NextResponse.json(
        { message: "order id and otp required" },
        { status: 400 },
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { message: "invalid order id" },
        { status: 400 },
      );
    }
    if (order.deliveryOtp !== otp) {
      return NextResponse.json({ message: "invalid otp" }, { status: 400 });
    }
    order.status = "delivered";
    order.deliveryOtpVerification = true;
    order.deliveredAt = new Date();
    await order.save();

    await emitEvenHandler("order-status-update", {
          orderId: order._id,
          status: order.status,
        });

    await DeliveryAssignment.updateOne(
        {order:orderId},
        {$set:{assignedTo:null, status:"completed" }}
    )
    return NextResponse.json({ message: "order delivered" },{status:200});
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "verify otp error" },
      { status: 500 },
    );
  }
}
