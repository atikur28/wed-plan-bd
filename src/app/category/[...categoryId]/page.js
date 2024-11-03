import Footer from "@/components/sharedUI/Footer";
import Navbar from "@/components/sharedUI/Navbar";
import { Box, Button, Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import Link from "next/link";

const Category = async ({ params }) => {
    // const res = await fetch(`http://localhost:3023/api/categories/${params.categoryId}`);
    // const data = await res.json();
    // const posts = data.result;

    // const approvedPosts = posts.filter(post => post.posted === 'Approved');

    // const categoryId = params.categoryId[0];
    // const name = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);

    return (
        <>
            <Navbar />
            <Box className="mt-8 w-[90%] mx-auto mb-10 min-h-[70vh]">
                {/* {approvedPosts.length > 0 && (<> <h2 className="text-2xl font-lora font-semibold">{name} posts:</h2> </>)}

                {approvedPosts.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', mt: 2 }}>
                        <Typography variant="body1" sx={{ color: "#555", fontFamily: "Lora, Serif" }}>
                            No approved posts available for {name} category.
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3} className="mt-2">
                        {approvedPosts.map((post) => (
                            <Grid item xs={12} sm={6} md={4} key={post._id}>
                                <Card
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        height: "100%",
                                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)",
                                        transition: "transform 0.3s, box-shadow 0.3s",
                                        '&:hover': {
                                            transform: "translateY(-5px)",
                                            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.15)"
                                        }
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={post.serviceImage}
                                        alt={post.serviceName}
                                        sx={{
                                            height: "300px",
                                            width: "100%",
                                            objectFit: "cover"
                                        }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                                        <Typography
                                            variant="h6"
                                            component="div"
                                            className="font-lora font-semibold"
                                            sx={{ color: "#333", fontSize: "20px" }}
                                        >
                                            {post.serviceName}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            color="textSecondary"
                                            sx={{ fontFamily: "Lora, Serif", fontSize: "18px", fontWeight: 600, color: "#555" }}
                                        >
                                            Supplier: <span style={{ color: "#3A539B" }}>{post.provider}</span>
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            sx={{ fontFamily: "Lora, Serif", fontSize: "15px", fontWeight: 600, color: "#555" }}
                                        >
                                            Location: <span style={{ color: "#3A539B" }}>{post.location}</span>
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            sx={{ fontFamily: "Lora, Serif", fontSize: "15px", fontWeight: 600, color: "#555" }}
                                        >
                                            Price: <span style={{ color: "#e63946" }}>{post.price} Taka</span>
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            sx={{ fontFamily: "Lora, Serif", fontSize: "15px", fontWeight: 600, color: "#555" }}
                                        >
                                            Available Days: <span style={{ color: "#3A539B" }}>{post.availableDays}</span>
                                        </Typography>
                                        <Box sx={{ display: "flex", justifyContent: "flex-end", flexShrink: 0, marginTop: "auto" }}>
                                            <Link href="/book" passHref>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    sx={{
                                                        background: "linear-gradient(45deg, #3A539B 30%, #1F618D 90%)",
                                                        fontFamily: "Lora, Serif",
                                                        color: "#fff",
                                                        transition: "background 0.3s",
                                                        '&:hover': {
                                                            background: "linear-gradient(45deg, #1F618D 30%, #154360 90%)"
                                                        }
                                                    }}
                                                >
                                                    Book Now
                                                </Button>
                                            </Link>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )} */}
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