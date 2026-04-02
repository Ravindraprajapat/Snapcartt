import { auth } from "@/auth";
import connectDb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignmentModel";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDb()
        const session = await auth()
        const deliveryBoyId = session?.user?.id
        const activeAssignment = await DeliveryAssignment.findOne({assignedTo:deliveryBoyId,
            status:"assigned"
        }).populate({
            path:"order",
            populate:{path:"address"}
        }).lean()
        if(!activeAssignment){
            return NextResponse.json({active:false,message:"No active assignment"},{status:400})
        }
        return NextResponse.json({active:true,assignment:activeAssignment},{status:200})
    } catch (error) {
        console.log("ERROR:",error);
        return NextResponse.json({message:"get current assignment error"}, {status:500})
    }
}