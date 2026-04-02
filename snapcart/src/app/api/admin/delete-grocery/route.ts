import { auth } from "@/auth";
import connectDb from "@/lib/db";
import { NextResponse } from "next/server";

import Grocery from "@/models/groceryModel";

export async function POST(req: Request) {
  try {
    await connectDb();

    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { message: "You are not admin" },
        { status: 403 }
      );
    }

   
    const {groceryId} = await req.json()

    const grocery = await Grocery.findByIdAndDelete(groceryId);

    return NextResponse.json(grocery, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "delete grocery  Error" },
      { status: 500 }
    );
  }
}



