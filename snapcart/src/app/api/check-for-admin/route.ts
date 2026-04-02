import connectDb from "@/lib/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const user = await User.find({ role: "admin" });
    if (user.length > 0) {
      return NextResponse.json({ adminExist: true }, { status: 200 });
    } else {
      return NextResponse.json({ adminExist: false }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
