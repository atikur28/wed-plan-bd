import User from "@/models/userModel";
import { mongoDbConnect } from "@/mongoDB/mongoDB";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextResponse } from "next/server";

mongoDbConnect();

export async function POST(request) {
    const userId = await getDataFromToken(request);
    const user = await User.findOne({ _id: userId }).select("-password");

    return NextResponse.json({
        message: "User found",
        success: true,
        data: user
    });
}