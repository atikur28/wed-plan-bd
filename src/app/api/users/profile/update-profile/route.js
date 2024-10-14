import User from "@/models/userModel";
import { mongoDbConnect } from "@/mongoDB/mongoDB";
import { NextResponse } from "next/server";

mongoDbConnect();

export async function PUT(req) {
    const { firstName, lastName, image, email, userCategory, status } = await req.json();

    try {
        if (!firstName || !lastName || !image || !email || !userCategory) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.image = image;
        user.email = email;
        user.password = user.password;
        user.userCategory = userCategory || user.userCategory;
        user.status = status || user.status;
        user.isVerified = user.isVerified;

        await user.save();

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error updating profile", error: error.message }, { status: 500 });
    }
}
