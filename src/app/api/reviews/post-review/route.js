import Review from "@/models/reviewModel";
import { mongoDbConnect } from "@/mongoDB/mongoDB";
import { NextResponse } from "next/server";

mongoDbConnect();

export async function POST(req) {
    try {
        const body = await req.json();

        const { name, email, review, image, recommendation, recommendationPost } = body;

        if (!name || !email || !review) {
            return NextResponse.json(
                { success: false, error: "Name, email, and review are required fields." },
                { status: 400 }
            );
        }

        const newReview = new Review({
            name,
            email,
            review,
            image,
            recommendation,
            recommendationPost,
        });

        const savedReview = await newReview.save();

        return NextResponse.json(
            { success: true, message: "Review created successfully", review: savedReview },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create review. Please try again." },
            { status: 500 }
        );
    }
}