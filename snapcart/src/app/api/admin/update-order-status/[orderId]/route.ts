import connectDb from "@/lib/db";
import emitEvenHandler from "@/lib/emitEvenHandler";
import DeliveryAssignment from "@/models/deliveryAssignmentModel";
import Order from "@/models/orderModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: any) {
  try {
    await connectDb();

    const { orderId } = context.params;

    if (!orderId) {
      return NextResponse.json({ message: "orderId missing" }, { status: 400 });
    }

    const { status } = await req.json();

    const order = await Order.findById(orderId).populate("user");

    if (!order) {
      return NextResponse.json({ message: "order not found" }, { status: 400 });
    }

    order.status = status;

    let deliveryBoysPayload: any = [];

    if (status === "out of delivery" && !order.assignment) {
      if (!order.address) {
        return NextResponse.json({ message: "Address not found" }, { status: 400 });
      }

      const latitude = Number(order.address?.latitude);
      const longitude = Number(order.address?.longitude);

      if (isNaN(latitude) || isNaN(longitude)) {
        return NextResponse.json({ message: "Invalid coordinates" }, { status: 400 });
      }

      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: 10000,
          },
        },
      });

      const nearByIds = nearByDeliveryBoys.map((b) => b._id);

      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $nin: ["broadcasted", "completed"] },
      }).distinct("assignedTo");

      const busyIdSet = new Set(busyIds.map((b) => String(b)));

      const availableDeliveryBoys = nearByDeliveryBoys.filter(
        (b) => !busyIdSet.has(String(b._id))
      );

      const candidates = availableDeliveryBoys.map((b) => b._id);

      if (candidates.length === 0) {
        await order.save();
        await emitEvenHandler("order-status-update", {
          orderId: order._id,
          status: order.status,
        });
        return NextResponse.json({ message: "Delivery boys not available" }, { status: 200 });
      }

      const deliveryAssignment = await DeliveryAssignment.create({
        order: order._id,
        broadcastedTo: candidates,
        status: "broadcasted",
      });

      await deliveryAssignment.populate("order");

      const boys = await User.find({ _id: { $in: candidates } });

      for (const boy of boys) {
        if (boy.socketId) {
          await emitEvenHandler("new-assignment", deliveryAssignment, boy.socketId);
        }
      }

      order.assignment = deliveryAssignment._id;

      deliveryBoysPayload = availableDeliveryBoys.map((b) => ({
        id: b._id,
        name: b.name,
        mobile: b.mobile,
        latitude: b.location.coordinates[1],
        longitude: b.location.coordinates[0],
      }));

      await deliveryAssignment.populate("order");
    }

    await order.save();
    await order.populate("user");

    await emitEvenHandler("order-status-update", {
      orderId: order._id,
      status: order.status,
    });

    return NextResponse.json(
      {
        assignment: order.assignment || null,
        availableBoys: deliveryBoysPayload,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Status error" }, { status: 500 });
  }
}













// import connectDb from "@/lib/db";
// import emitEvenHandler from "@/lib/emitEvenHandler";
// import DeliveryAssignment from "@/models/deliveryAssignmentModel";
// import Order from "@/models/orderModel";
// import User from "@/models/userModel";
// import { NextRequest, NextResponse } from "next/server";
// import { emit } from "process";

// export async function POST(req: NextRequest, context: any) {
//   try {
//     await connectDb();

//     const params = await context.params;
//     const orderId = params.orderId?.orderId || params.orderId;

//     if (!orderId) {
//       return NextResponse.json({ message: "orderId missing" }, { status: 400 });
//     }

//     const { status } = await req.json();

//     const order = await Order.findById(orderId).populate("user");

//     if (!order) {
//       return NextResponse.json({ message: "order not found" }, { status: 400 });
//     }

//     order.status = status;

//     let deliveryBoysPayload: any = [];

//     if (status === "out of delivery" && !order.assignment) {
//       if (!order.address) {
//         return NextResponse.json(
//           { message: "Address not found" },
//           { status: 400 },
//         );
//       }

//       const { latitude, longitude } = order.address;

//       const nearByDeliveryBoys = await User.find({
//         role: "deliveryBoy",
//         location: {
//           $near: {
//             $geometry: {
//               type: "Point",
//               coordinates: [Number(longitude), Number(latitude)],
//             },
//             $maxDistance: 10000,
//           },
//         },
//       });
//       console.log("api hit");
//       console.log("Nearby Delivery Boys:", nearByDeliveryBoys.length);
//       const nearByIds = nearByDeliveryBoys.map((b) => b._id);

//       const busyIds = await DeliveryAssignment.find({
//         assignedTo: { $in: nearByIds },
//         status: { $nin: ["broadcasted", "completed"] },
//       }).distinct("assignedTo");

//       const busyIdSet = new Set(busyIds.map((b) => String(b)));

//       const availableDeliveryBoys = nearByDeliveryBoys.filter(
//         (b) => !busyIdSet.has(String(b._id)),
//       );

//       const candidates = availableDeliveryBoys.map((b) => b._id);

//       if (candidates.length === 0) {
//         await order.save();
//         await emitEvenHandler("order-status-update", {
//           orderId: order._id,
//           status: order.status,
//         });
//         return NextResponse.json(
//           { message: "Delivery boys not available" },
//           { status: 200 },
//         );
//       }

//       const deliveryAssignment = await DeliveryAssignment.create({
//         order: order._id,
//         broadcastedTo: candidates,
//         status: "broadcasted",
//       });

//       await deliveryAssignment.populate("order")
//       for(const boyId of candidates){
//         const boy = await User.findById(boyId);
//         if(boy.socketId){
//           await emitEvenHandler("new-assignment",deliveryAssignment,boy.socketId)
//         }
//       }

//       order.assignment = deliveryAssignment._id;

//       deliveryBoysPayload = availableDeliveryBoys.map((b) => ({
//         id: b._id,
//         name: b.name,
//         mobile: b.mobile,
//         latitude: b.location.coordinates[1],
//         longitude: b.location.coordinates[0],
//       }));

//       await deliveryAssignment.populate("order");
//     }

//     await order.save();
//     await order.populate("user");
//     await emitEvenHandler("order-status-update", {
//       orderId: order._id,
//       status: order.status,
//     });

//     return NextResponse.json(
//       {
//         assignment: order.assignment || null,
//         availableBoys: deliveryBoysPayload,
//       },
//       { status: 200 },
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ message: "Status error" }, { status: 500 });
//   }
// }

