import Provider from "@/models/providerModel";
import { mongoDbConnect } from "@/mongoDB/mongoDB";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

mongoDbConnect();

export async function PUT(req) {
  try {
    const { name, posts, email, cost, age, address, status, professionName, photos, videos, bio, additionalInfo, popularity } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Invalid provider Email." }, { status: 400 });
    }

    const provider = await Provider.findOne({ email });
    if (!provider) {
      return NextResponse.json({ error: "Provider not found." }, { status: 404 });
    }

    provider.name = name || provider.name;
    provider.posts = posts || provider.posts;
    provider.email = provider.email;
    provider.cost = cost || provider.cost;
    provider.age = age || provider.age;
    provider.address = address || provider.address;
    provider.status = status || provider.status;
    provider.professionName = professionName || provider.professionName;
    provider.photos = photos || provider.photos;
    provider.videos = videos || provider.videos;
    provider.bio = bio || provider.bio;
    provider.additionalInfo = additionalInfo || provider.additionalInfo;
    provider.popularity = popularity || provider.popularity;

    await provider.save();

    return NextResponse.json({ message: "Provider updated successfully!", success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update provider.", details: error.message }, { status: 500 });
  }
}
