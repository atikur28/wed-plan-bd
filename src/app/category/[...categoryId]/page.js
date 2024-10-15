import { Box, Card, CardContent, CardMedia, Grid } from "@mui/material";

const Category = async ({ params }) => {
    const res = await fetch(`http://localhost:3012/api/categories/${params.categoryId}`);
    const data = await res.json();
    const providers = data.result;

    return (
        <Box className="mt-8 w-[90%] mx-auto mb-10">
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
    );
};

export default Category;
