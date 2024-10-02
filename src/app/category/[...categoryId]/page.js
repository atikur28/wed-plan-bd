import { Box, Card, CardContent, CardMedia, Grid, Rating, Typography } from "@mui/material";

const Category = async ({ params }) => {
    const res = await fetch(`http://localhost:3002/api/categories/${params.categoryId}`);
    const data = await res.json();
    const providers = data.result;

    return (
        <Box className="mt-8 w-[90%] mx-auto mb-10">
            <Typography className="lg:text-lg xl:text-xl font-lora font-semibold mb-8 dark:text-white">
                {providers[0]?.professionName}
            </Typography>

            {/* Providers Grid */}
            <Grid container spacing={4}>
                {providers.map((provider) => (
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
                                <Typography className="font-lora font-semibold dark:text-white" variant="h6">
                                    {provider.name}
                                </Typography>
                                <Typography className="text-[15px] font-lora font-bold dark:text-white" variant="body2" color="textSecondary">
                                    Address: {provider.address}
                                </Typography>

                                <Typography className="flex justify-start items-center text-[18px] font-lora font-semibold dark:text-white">
                                    Ratings:
                                    <Rating
                                        name="read-only"
                                        value={provider.rating}
                                        precision={0.1}
                                        readOnly
                                    />
                                </Typography>

                                <Typography className="font-lora font-extrabold dark:text-white" variant="body2" color="textSecondary">
                                    Popularity: {provider.popularity}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Category;
