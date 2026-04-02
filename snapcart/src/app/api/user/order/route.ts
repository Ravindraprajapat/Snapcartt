import connectDb from "@/lib/db";
import emitEvenHandler from "@/lib/emitEvenHandler";
import Order from "@/models/orderModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectDb();
        const {userId,items,paymentMethod,totalAmount,address} = await req.json();
        if(!userId || !items || !paymentMethod || totalAmount === undefined || !address){
            return NextResponse.json({message:"All fields are required"}, {status:400})
        }
        const user = await User.findById(userId)
        if(!user){
            return NextResponse.json({message:"User not found"},{status:404})
        }

        const newOrder = await Order.create({
            user:userId,
            items,
            paymentMethod,
            totalAmount,
            address
        })

        await emitEvenHandler("new order",newOrder)

        return NextResponse.json(newOrder, {status:201})    
    } catch (error) {
         console.log("ORDER ERROR:", error);
        return NextResponse.json({message:"Internal server error"}, {status:500})
    }
}