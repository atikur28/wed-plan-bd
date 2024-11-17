import Post from "@/models/postModel";
import { mongoDbConnect } from "@/mongoDB/mongoDB";
import { NextResponse } from "next/server";

mongoDbConnect();

export async function PUT(request) {
    const { postId, userId, email } = await request.json();

    try {
        if (!postId || !userId || !email) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
        }

        const existingLikeIndex = post.liked.findIndex(like => like.email === email);

        if (existingLikeIndex !== -1) {
            post.liked.splice(existingLikeIndex, 1);
            await post.save();

            return NextResponse.json({
                success: true,
                message: "Like removed successfully!",
                updatedPost: post
            });
        } else {
            post.liked.push({ userId, email, postId });
            await post.save();

            return NextResponse.json({
                success: true,
                message: "Post liked successfully!",
                updatedPost: post
            });
        }
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}
