import { Box, Typography, Card, CardContent, CardMedia, Grid, Rating } from "@mui/material";

const Category = async ({ params }) => {
    const res = await fetch(`http://localhost:3028/api/categories/${params.categoryId}`);
    const data = await res.json();
    const providers = data.result;

    return (
        <Box className="mt-8 w-[90%] mx-auto mb-10">
            {/* Category Title */}
            <Typography className="lg:text-lg xl:text-xl font-lora font-semibold mb-8">
                {providers[0]?.professionName}
            </Typography>

            {/* Providers Grid */}
            <Grid container spacing={4}>
                {providers.map((provider) => (
                    <Grid item key={provider._id} xs={12} sm={6} md={4} lg={3}>
                        {/* Card for each provider */}
                        <Card className="shadow-lg">
                            {/* Provider Image */}
                            <CardMedia
                                component="img"
                                height="140"
                                image={provider.professionImage}
                                alt={provider.professionName}
                            />

                            {/* Provider Info */}
                            <CardContent>
                                <Typography className="font-lora font-semibold" variant="h6">
                                    {provider.name}
                                </Typography>
                                <Typography className="text-[15px] font-lora font-bold" variant="body2" color="textSecondary">
                                    Address: {provider.address}
                                </Typography>

                                {/* Star Rating */}
                                <Typography className="flex justify-start items-center text-[18px] font-lora font-semibold">
                                    Ratings:
                                    <Rating
                                        name="read-only"
                                        value={provider.rating}
                                        precision={0.1} // Allows for decimal ratings
                                        readOnly
                                    />
                                </Typography>

                                <Typography className="font-lora font-extrabold" variant="body2" color="textSecondary">
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
