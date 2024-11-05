import Post from "@/models/postModel";
import { mongoDbConnect } from "@/mongoDB/mongoDB";
import { NextResponse } from "next/server";

mongoDbConnect();

export async function PUT(request) {
    const {id, serviceName, provider, serviceImage, email, status, professionName, posted, number, price, location, availableDays, booked, bookedFor, description, days, liked, ratings, review} = await request.json();

    try {

        if (!id || !email) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const post = await Post.findById(id);

        if (!post) {
            return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
        }

        post.serviceName = serviceName || post.serviceName;
        post.provider = provider || post.provider;
        post.serviceImage = serviceImage || post.serviceImage;
        post.email = post.email;
        post.status = status || post.status;
        post.professionName = professionName || post.professionName;
        post.posted = posted || post.posted;
        post.number = number || post.number;
        post.price = price || post.price;
        post.location = location || post.location;
        post.availableDays = availableDays || post.availableDays;
        post.booked = booked || post.booked;
        post.bookedFor = bookedFor || post.bookedFor;
        post.description = description || post.description;
        post.days = days || post.days;
        post.liked = liked || post.liked;
        post.ratings = ratings || post.ratings;
        post.review = review || post.review;

        await post.save();

        return NextResponse.json({
            success: true,
            message: "Post updated successfully",
            updatedPost: post
        });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}