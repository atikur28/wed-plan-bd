import Post from "@/models/postModel";
import { mongoDbConnect } from "@/mongoDB/mongoDB";
import { NextResponse } from "next/server";

mongoDbConnect();

export async function DELETE(req) {
    try {
        const { postId } = await req.json();

        if (!postId) {
            return NextResponse.json(
                { success: false, message: "Post ID is required!" },
                { status: 400 }
            );
        }

        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return NextResponse.json(
                { success: false, message: "Post not found!" },
                { status: 404 }
            );
        }

        // Successfully deleted the post
        return NextResponse.json(
            { success: true, message: "Post deleted successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting post:", error);

        return NextResponse.json(
            { success: false, message: "Failed to delete post!" },
            { status: 500 }
        );
    }
}