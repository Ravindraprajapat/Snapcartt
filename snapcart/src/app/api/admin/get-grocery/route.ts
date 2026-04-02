import connectDb from "@/lib/db";
import Grocery from "@/models/groceryModel";
import { NextResponse } from "next/server";

export async function GET() {
   try {
    await connectDb()
    const groceries = await Grocery.find({})
    return NextResponse.json(groceries,{status:200})
   } catch (error) {
    return NextResponse.json({message:"get groceries  error"}, {status:500})
   }
}