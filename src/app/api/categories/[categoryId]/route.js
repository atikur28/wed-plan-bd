import Post from "@/models/postModel";
import { mongoDbConnect } from "@/mongoDB/mongoDB";
import { NextResponse } from "next/server";

mongoDbConnect();

export async function GET(request, { params }) {
    const { categoryId } = params;

    try {
        const posts = await Post.find({ status: categoryId });

        if (posts.length === 0) {
            return NextResponse.json({ message: "No posts found for this category." }, { status: 404 });
        }

        return NextResponse.json({result: posts, success: true});
    } catch (error) {
        console.error("Error fetching providers:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
