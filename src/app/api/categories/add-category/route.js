// pages/api/categories/add-category.js
import Category from "@/models/categoryModel";
import { mongoDbConnect } from "@/mongoDB/mongoDB";
import { NextResponse } from "next/server";

mongoDbConnect();

export async function POST(request) {
    try {
        const { name, image, pathName } = await request.json();

        if (!name || !image || !pathName) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
        }

        const newCategory = new Category({ name, image, pathName });
        await newCategory.save();

        return NextResponse.json({ success: true, result: newCategory }, { status: 201 });
    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
