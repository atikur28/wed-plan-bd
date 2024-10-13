import User from "@/models/userModel";
import { mongoDbConnect } from "@/mongoDB/mongoDB";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextResponse } from "next/server";

mongoDbConnect();

export async function POST(request) {
    try {
        const userId = await getDataFromToken(request);

        const user = await User.findOne({ _id: userId }).select("-password");

        if (!user) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 404 });
        }

        return NextResponse.json({
            message: "User found",
            success: true,
            result: user
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            message: "An error occurred",
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
