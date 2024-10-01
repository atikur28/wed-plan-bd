import Category from "@/models/categoryModel";
import { mongoDbConnect } from "@/mongoDB/mongoDB";
import { NextResponse } from "next/server";

mongoDbConnect();

export async function GET() {
    let data = [];

    try {
        data = await Category.find();
    } catch (error) {
        data = { success: false };
    }

    return NextResponse.json({ result: data, success: true });
}