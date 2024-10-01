import User from "@/models/userModel";
import { mongoDbConnect } from "@/mongoDB/mongoDB";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendMail } from "@/utils/sendEmail";

mongoDbConnect();

export async function POST(request) {
    try {
        const payload = await request.json();
        const {firstName, lastName, userCategory, email, password} = payload;

        const user = await User.findOne({email});

        if(user) {
            return NextResponse.json({error: "User already exists"}, {status: 400}); 
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            userCategory,
            email,
            password: hashedPassword,
            status: "User"
        });

        const savedUser = await newUser.save();

        await sendMail({email, emailType: "VERIFY", userId: savedUser._id})

        return NextResponse.json({
            message: "User registered successfully!",
            success: true,
            savedUser
        })

    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}