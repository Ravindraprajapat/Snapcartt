import { auth } from "@/auth";
import connectDb from "@/lib/db";
import emitEvenHandler from "@/lib/emitEvenHandler";
import DeliveryAssignment from "@/models/deliveryAssignmentModel";
import Order from "@/models/orderModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();

   const { id } = await context.params;
    const session = await auth();
    const deliveryBoyId = session?.user?.id;

    if (!deliveryBoyId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const assignment = await DeliveryAssignment.findById(id);

    if (!assignment) {
      return NextResponse.json(
        { message: "Assignment not found" },
        { status: 404 },
      );
    }

    if (assignment.status !== "broadcasted") {
      return NextResponse.json(
        { message: "Assignment cannot be accepted" },
        { status: 400 },
      );
    }

    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: deliveryBoyId,
      status: { $nin: ["broadcasted", "completed"] },
    });

    if (alreadyAssigned) {
      return NextResponse.json(
        { message: "You already have an active assignment" },
        { status: 400 },
      );
    }

    assignment.assignedTo = deliveryBoyId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();

    const order = await Order.findById(assignment.order);

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 },
      );
    }

    order.assignedDeliveryBoy = deliveryBoyId;
    await order.save();

    await order.populate("assignedDeliveryBoy")

    await emitEvenHandler("order-assigned",{orderId:order._id,assignedDeliveryBoy:order.assignedDeliveryBoy})

    await DeliveryAssignment.updateMany(
      {
        _id: { $ne: assignment._id },
        broadcastedTo: deliveryBoyId,
        status: "broadcasted",
      },
      {
        $pull: { broadcastedTo: deliveryBoyId },
      }
    );



    return NextResponse.json(
      { message: "Assignment accepted successfully" },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
