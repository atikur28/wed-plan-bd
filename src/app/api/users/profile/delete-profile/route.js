import User from "@/models/userModel";
import { mongoDbConnect } from "@/mongoDB/mongoDB";
import { NextResponse } from "next/server";

mongoDbConnect();

export async function DELETE(req) {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "User ID is required!",
            }, { status: 400 });
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return NextResponse.json({
                success: false,
                message: "User not found!",
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "User deleted successfully!",
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to delete user!",
        }, { status: 500 });
    }
}