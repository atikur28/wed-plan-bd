import Footer from "@/components/sharedUI/Footer";
import Navbar from "@/components/sharedUI/Navbar";
import CategoryPostUI from "@/components/ui/CategoryPostUI";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

const Category = async ({ params }) => {
    return (
        <>
            <Navbar />
            <CategoryPostUI params={params} />
            <Footer />
        </>
    );
};

export default Category;

export function generateMetadata({ params }) {
    const categoryId = params.categoryId[0];
    const name = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);

    return {
        title: `${name} - WedPlan BD`,
        description: `Discover the best options for ${name} to help you plan your perfect wedding on WedPlan BD. Find and connect with top vendors to make your big day special.`
    }
}