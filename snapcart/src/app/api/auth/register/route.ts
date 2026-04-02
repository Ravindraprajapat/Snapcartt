import connectDb from "@/lib/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { name, email, password } = await req.json();

    // 1️⃣ Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // 2️⃣ Check user
    const existingUser = await User.findOne({ email });

    // 🟢 Case A: Email exists but NO password (Google user)
    if (existingUser && !existingUser.password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.name = name;
      existingUser.password = hashedPassword;
      await existingUser.save();

      return NextResponse.json(
        { message: "Password set successfully. You can now login." },
        { status: 200 }
      );
    }

    // 🔴 Case B: Email exists with password
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists. Please login." },
        { status: 400 }
      );
    }

    // 3️⃣ Create new user
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
