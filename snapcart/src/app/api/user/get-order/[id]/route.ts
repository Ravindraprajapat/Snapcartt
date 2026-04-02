
import connectDb from "@/lib/db";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();

    const { id } = await context.params; // ✅ FIX

    const order = await Order.findById(id)
      .populate("assignedDeliveryBoy");

    if (!order) {
      return NextResponse.json(
        { message: "order not found" },
        { status: 400 }
      );
    }

    return NextResponse.json(order, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "order get order by id error" },
      { status: 500 }
    );
  }
}