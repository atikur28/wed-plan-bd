import { mongoDbConnect } from "@/mongoDB/mongoDB";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

mongoDbConnect();

export async function POST(request) {
    try {
        const payload = await request.json();
        const { email, password } = payload;

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User does not exist!" }, { status: 400 });
        }

        // Check if the user is verified
        if (!user.isVerified) {
            return NextResponse.json({ error: "Please verify your email first." }, { status: 400 });
        }

        const validPassword = await bcryptjs.compare(password, user.password);

        if (!validPassword) {
            return NextResponse.json({ error: "Password is incorrect!" }, { status: 400 });
        }

        const tokenPayload = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        };

        const token = await jwt.sign(tokenPayload, process.env.SECRET_TOKEN, { expiresIn: "1d" });

        const response = NextResponse.json({ message: "Logged in successfully!", success: true });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",  // Set to secure in production
        });

        return response;

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}