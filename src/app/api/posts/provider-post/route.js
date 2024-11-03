import Post from "@/models/postModel";
import { mongoDbConnect } from "@/mongoDB/mongoDB";
import { NextResponse } from "next/server";

mongoDbConnect();

export async function POST(request) {
  try {
    const { serviceName, provider, serviceImage, email, status, professionName, number, price, location, availableDays, description, days } = await request.json();

    if (!serviceName || !provider || !serviceImage || !email || !number || !location || !description) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields. Please ensure all required fields are provided."
      });
    }

    const newPost = new Post({
      serviceName,
      provider,
      serviceImage,
      email,
      status,
      professionName,
      posted: "Pending",
      number,
      price,
      location,
      availableDays,
      booked: "Available",
      bookedFor: 0,
      description,
      days: days || "",
      liked : [],
      ratings: {
        average: 0,
        count: 0,
        userRatings: []
      },
      review: [],
      date: new Date()
    });

    const savedPost = await newPost.save();

    return NextResponse.json({
      success: true,
      message: "Post created successfully!",
      data: savedPost
    });

  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({
      success: false,
      error: "An error occurred while creating the post. Please try again later."
    });
  }
}
