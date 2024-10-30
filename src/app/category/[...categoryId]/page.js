import Footer from "@/components/sharedUI/Footer";
import Navbar from "@/components/sharedUI/Navbar";
import { Box } from "@mui/material";

const Category = async ({ params }) => {
    // const res = await fetch(`http://localhost:3022/api/categories/${params.categoryId}`);
    // const data = await res.json();
    // const providers = data.result;

    return (
        <>
            <Navbar />
            <Box className="mt-8 w-[90%] mx-auto mb-10 min-h-[70vh]">
                <h1>Hello</h1>
            </Box>
            <Footer />
        </>
    );
};

export default Category;

// export function generateMetadata({ params }) {
//     const categoryId = params.categoryId[0];
//     const name = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);

//     return {
//         title: `${name} - WedPlan BD`,
//         description: `Discover the best options for ${name} to help you plan your perfect wedding on WedPlan BD. Find and connect with top vendors to make your big day special.`
//     }
// }
