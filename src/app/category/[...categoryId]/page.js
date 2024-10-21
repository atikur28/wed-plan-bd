import Footer from "@/components/sharedUI/Footer";
import { Box, Card, CardContent, CardMedia, Grid } from "@mui/material";

const Category = async ({ params }) => {
    const res = await fetch(`http://localhost:3015/api/categories/${params.categoryId}`);
    const data = await res.json();
    const providers = data.result;

    return (
        <>
            <Box className="mt-8 w-[90%] mx-auto mb-10 min-h-[70vh]">
                <h3 className="lg:text-lg xl:text-xl font-lora font-semibold mb-8 dark:text-white">
                    {providers[0]?.professionName}
                </h3>

                {/* Providers Grid */}
                <Grid container spacing={4}>
                    {providers
                        .filter(
                            (provider) =>
                                provider.professionImage || provider.address || provider.cost
                        )
                        .map((provider) => (
                            <Grid item key={provider._id} xs={12} sm={6} md={4} lg={3}>
                                {/* Card for each provider */}
                                <Card className="shadow-lg dark:bg-dark">
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={provider.professionImage}
                                        alt={provider.professionName}
                                    />

                                    <CardContent>
                                        <h5
                                            className="text-xl font-lora font-semibold dark:text-white"
                                        >
                                            {provider.name}
                                        </h5>
                                        <p
                                            className="text-[17px] font-lora font-bold text-gray-500 dark:text-white my-2"
                                        >
                                            Address: {provider.address}
                                        </p>

                                        <p
                                            className="text-[15px] font-lora font-extrabold text-gray-500 dark:text-white"
                                        >
                                            Popularity: {provider.popularity.length}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                </Grid>
            </Box>
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
