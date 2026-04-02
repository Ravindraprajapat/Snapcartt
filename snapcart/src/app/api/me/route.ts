import { auth } from "@/auth";
import User from "@/models/userModel";
import { NextRequest } from "next/server";
import connectDb from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();

    if (!session || !session.user) {
      return Response.json({ message: "Not authenticated" }, { status: 401 });
    }
    console.log("SESSION:", session);
    console.log("EMAIL:", session?.user?.email);
    const user = await User.findOne({
      email: session.user.email,
    }).select("-password");

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 200 });
    }

    return Response.json(user, { status: 200 }); // ✅ fixed status
  } catch (error) {
    return Response.json(
      { message: "Internal server error at get userDetails" },
      { status: 500 },
    );
  }
}
