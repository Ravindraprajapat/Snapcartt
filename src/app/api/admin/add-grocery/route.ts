import { auth } from "@/auth";
import connectDb from "@/lib/db";
import { NextResponse } from "next/server";
import uploadOnCloudinary from "@/lib/cloudinary";
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

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const category = formData.get("category") as string;
    const unit = formData.get("unit") as string;
    const image = formData.get("image") as Blob | null;

    let imageUrl: string | null = null;

    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      imageUrl = await uploadOnCloudinary(buffer);
    }

    const grocery = await Grocery.create({
      name,
      price,
      category,
      unit,
      image: imageUrl,
    });

    return NextResponse.json(grocery, { status: 200 });
  } catch (error) {
    console.error("API ERROR:", error); // 👈 add this
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}


// export async function POST(req: Request) {
//   try {
//     await connectDb();

//     const session = await auth();
//     if (session?.user?.role !== "admin") {
//       return NextResponse.json(
//         { message: "You are not admin" },
//         { status: 403 }
//       );
//     }

//     const formData = await req.formData();
//     const name = formData.get("name") as string;
//     const price = formData.get("price") as string;
//     const category = formData.get("category") as string;
//     const unit = formData.get("unit") as string;
//     const image = formData.get("image") as Blob | null;

//     let imageUrl: string | null = null;
//     if (image) {
//       imageUrl = await uploadOnCloudinary(image);
//     }

//     const grocery = await Grocery.create({
//       name,
//       price,
//       category,
//       unit,
//       image: imageUrl,
//     });

//     return NextResponse.json(grocery, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Internal Server Error", error },
//       { status: 500 }
//     );
//   }
// }
