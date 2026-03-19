import { auth } from "@/auth";
import connectDb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignmentModel";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDb()
        const session = await auth()
        const assignments = await DeliveryAssignment.find({
            broadcastedTo:session?.user?.id,
            status:"broadcasted"
        }).populate("order")
        return NextResponse.json({
            assignments,
        },{status:200})
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}