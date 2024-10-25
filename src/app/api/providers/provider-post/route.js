import Provider from "@/models/providerModel";
import { mongoDbConnect } from "@/mongoDB/mongoDB";
import { NextResponse } from "next/server";

mongoDbConnect();

export async function POST(req) {
  try {
    const { name, posts, email, status, professionName, photos, videos, popularity } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required fields." }, { status: 400 });
    }

    const newProvider = new Provider({
      name,
      posts,
      email,
      status,
      professionName,
      photos,
      videos,
      popularity,
    });

    await newProvider.save();

    return NextResponse.json({ message: "Provider created successfully!", provider: newProvider }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Failed to create provider.", details: error.message }, { status: 500 });
  }
}
