import connectDb from "@/lib/db";
import { sendEmail } from "@/lib/mailer";
import Order from "@/models/orderModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectDb()
        const {orderId} = await req.json()
        const order = await Order.findById(orderId).populate("user")
        if(!order){
            return NextResponse.json({message:"order id required"} , {status:400})
        }
        const otp =  (1000 + Math.floor(Math.random() * 9000)).toString();
        order.deliveryOtp = otp;
        await order.save()

        await sendEmail(
            order.user.email,
            "your delivery otp",
            `<h2>Your delivery OTP for order  is <strong>${otp}</strong></h2>`)
        return NextResponse.json({message:"otp sent successfully"})
    } catch (error) {
        console.log(error);
        return NextResponse.json({message:"send otp error"}, {status:500})
    }
}