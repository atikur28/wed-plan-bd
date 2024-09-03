import { mongoDbConnect } from "@/mongoDB/mongoDB";
import { NextResponse } from "next/server";

mongoDbConnect();

export async function GET(request) {
    try {
        const response = NextResponse.json({
            message: "Logout successfully!",
            success: true
        });

        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        });

        return response;
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}