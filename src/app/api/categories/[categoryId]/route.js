import Provider from "@/models/providerModel";
import { mongoDbConnect } from "@/mongoDB/mongoDB";
import { NextResponse } from "next/server";

mongoDbConnect();

export async function GET(request, { params }) {
    const { categoryId } = params;

    try {
        const providers = await Provider.find({ status: categoryId });

        if (providers.length === 0) {
            return NextResponse.json({ message: "No providers found for this category." }, { status: 404 });
        }

        return NextResponse.json({result: providers, success: true});
    } catch (error) {
        console.error("Error fetching providers:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
