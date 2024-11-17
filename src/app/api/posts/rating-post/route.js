import Post from "@/models/postModel";
import User from "@/models/userModel";
import { mongoDbConnect } from "@/mongoDB/mongoDB";
import { NextResponse } from "next/server";

mongoDbConnect();

export async function POST(request) {
    try {
        const { postId, userId, ratingValue } = await request.json();

        if (!postId || !userId || typeof ratingValue !== "number") {
            return NextResponse.json(
                { success: false, message: "Invalid data" },
                { status: 400 }
            );
        }

        const post = await Post.findById(postId);

        if (!post) {
            return NextResponse.json(
                { success: false, message: "Post not found" },
                { status: 404 }
            );
        }

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "You have sign in first!" },
                { status: 404 }
            );
        }

        const existingRating = post.ratings.userRatings.find(
            (rating) => rating.userId.toString() === userId
        );

        if (existingRating) {
            return NextResponse.json(
                { success: false, message: "You can only rate once." },
                { status: 400 }
            );
        }

        post.ratings.userRatings.push({ userId, ratingValue });
        post.ratings.count++;
        post.ratings.average =
            post.ratings.userRatings.reduce((acc, curr) => acc + curr.ratingValue, 0) /
            post.ratings.count;

        await post.save();

        return NextResponse.json({
            success: true,
            message: "Rating added successfully!",
            updatedPost: post,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}