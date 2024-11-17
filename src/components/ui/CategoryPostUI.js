"use client"

import { ThumbUp as ThumbUpIcon } from "@mui/icons-material";
import { Alert, Box, Button, Card, CardContent, CardMedia, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Rating, Snackbar, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

const CategoryPostUI = ({ params }) => {
    const [user, setUser] = useState(null);
    const [approvedPosts, setApprovedPosts] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [review, setReview] = useState("");
    const [likes, setLikes] = useState({});
    const [loading, setLoading] = useState(true);

    // Alert Code:
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("success");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // User data get
                const userResponse = await fetch("http://localhost:3034/api/users/profile", {
                    method: "POST",
                    credentials: "include",
                });
                const userData = await userResponse.json();
                if (userData.success) {
                    setUser(userData.result);
                }

                // Posts data get
                const res = await fetch(`http://localhost:3034/api/categories/${params.categoryId}`);
                const data = await res.json();
                const posts = data.result;

                const approvalPosts = posts.filter(post => post.posted === 'Approved');
                setApprovedPosts(approvalPosts);
            } catch (error) {
                console.log("Failed to fetch data: ", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [params])

    const categoryId = params.categoryId[0];
    const name = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);

    // Alert Code:
    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertOpen(false);
    };

    const handleRating = async (postId, ratingValue) => {
        try {
            const userId = await user._id;
            const response = await fetch('http://localhost:3034/api/posts/rating-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId, userId, ratingValue }),
            });

            const result = await response.json();

            if (result.success) {
                setAlertMessage("Rating added successfully!");
                setAlertType("success");
                setAlertOpen(true);

                setApprovedPosts((prevApprovedPosts) =>
                    prevApprovedPosts.map((post) =>
                        post._id === postId
                            ? {
                                ...post,
                                ratings: {
                                    ...post.ratings,
                                    userRatings: [
                                        ...(post.ratings.userRatings || []),
                                        { userId, ratingValue },
                                    ],
                                    count: post.ratings.count + 1,
                                    average: (
                                        (post.ratings.average * post.ratings.count + ratingValue) /
                                        (post.ratings.count + 1)
                                    ).toFixed(1),
                                },
                            }
                            : post
                    )
                );
            } else {
                setAlertMessage(result.message || "Failed to add rating!");
                setAlertType("error");
                setAlertOpen(true);
            }
        } catch (error) {
            console.log(error.message);
            setAlertMessage("Error adding rating: ", error.message);
            setAlertType("error");
            setAlertOpen(true);
        }
    };

    // Function to handle likes
    const handleLike = async (postId) => {
        try {
            const userId = user._id;
            const email = user.email;

            const response = await fetch('http://localhost:3034/api/posts/like-post', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId, userId, email }),
            });

            const data = await response.json();

            if (data.success) {
                setApprovedPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post._id === postId
                            ? { ...post, liked: data.updatedPost.liked, likes: data.updatedPost.liked.length }
                            : post
                    )
                );
            } else {
                setAlertMessage(data.message);
                setAlertType("error");
                setAlertOpen(true);
            }
        } catch (error) {
            console.log(error.message);
            setAlertMessage("Error liking the post: " + error.message);
            setAlertType("error");
            setAlertOpen(true);
        }
    };

    // Open review dialog
    const handleOpenReviewDialog = (post) => {
        setSelectedPost(post);
        setOpen(true);
    };

    const handleCloseReviewDialog = () => {
        setOpen(false);
        setReview("");
    };

    // Submit review data
    const handleSubmitReview = async () => {
        try {
            const payload = {
                name: user?.name,
                email: user?.email,
                review,
                image: user?.image || "",
                recommendation: selectedPost?.serviceName || "",
                recommendationPost: selectedPost?.professionName || "",
            };

            const response = await fetch("http://localhost:3034/api/reviews/post-review", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!data.success) {
                setAlertMessage(data.error || "Failed to submit review.");
                setAlertType("error");
                setAlertOpen(true);
                return;
            } else {
                setAlertMessage(data.message || "Review submitted successfully!");
                setAlertType("success");
                setAlertOpen(true);

                handleCloseReviewDialog();
            }
        } catch (error) {
            console.error("Error during review submission:", error);
            setAlertMessage("An unexpected error occurred. Please try again.");
            setAlertType("error");
            setAlertOpen(true);
        }
    };

    // Render loading state or user information
    if (loading) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="60vh"
                textAlign="center"
                p={2}
            >
                <CircularProgress size={60} color="primary" />
                <Typography variant="h6" mt={2} className="font-lora">
                    Loading, please wait...
                </Typography>
            </Box>
        );
    }

    return (
        <Box className="mt-8 w-[90%] mx-auto mb-10 min-h-[70vh]">
            {approvedPosts.length > 0 && (<> <h2 className="text-2xl font-lora font-semibold">{name} posts:</h2> </>)}

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
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.15)',
                                    },
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={post.serviceImage}
                                    alt={post.serviceName}
                                    sx={{
                                        height: '300px',
                                        width: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        sx={{
                                            color: '#333',
                                            fontFamily: 'Lora, serif',
                                            fontWeight: 600,
                                            fontSize: '24px',
                                        }}
                                    >
                                        {post.serviceName}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="textSecondary"
                                        sx={{
                                            fontFamily: 'Lora, Serif',
                                            fontSize: '18px',
                                            fontWeight: 600,
                                            color: '#555',
                                        }}
                                    >
                                        Supplier: <span style={{ color: '#3A539B' }}>{post.provider}</span>
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{
                                            fontFamily: 'Lora, Serif',
                                            fontSize: '15px',
                                            fontWeight: 600,
                                            color: '#555',
                                        }}
                                    >
                                        Location: <span style={{ color: '#3A539B' }}>{post.location}</span>
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{
                                            fontFamily: 'Lora, Serif',
                                            fontSize: '15px',
                                            fontWeight: 600,
                                            color: '#555',
                                        }}
                                    >
                                        Price: <span style={{ color: '#e63946' }}>{post.price} Taka {post?.days && (<span>for {post?.days}</span>)}</span>
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', }}>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            sx={{
                                                fontFamily: 'Lora, serif',
                                                fontSize: '15px',
                                                fontWeight: 600,
                                                marginRight: '8px',
                                            }}
                                        >
                                            Rating:
                                        </Typography>
                                        <Rating
                                            name={`rating-${post._id}`}
                                            value={post.ratings.average}
                                            precision={0.1}
                                            onChange={(event, newValue) => handleRating(post._id, newValue)}
                                        />
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            sx={{
                                                fontFamily: 'Lora, serif',
                                                fontSize: '15px',
                                                fontWeight: 600,
                                                marginLeft: '8px',
                                            }}
                                        >
                                            ({post.ratings.count} ratings)
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{
                                            fontFamily: 'Lora, Serif',
                                            fontSize: '15px',
                                            fontWeight: 600,
                                            color: '#555',
                                        }}
                                    >
                                        Available Days: <span style={{ color: '#3A539B' }}>{post.availableDays}</span>
                                    </Typography>

                                    {/* Button Row Section */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-start',
                                            alignItems: 'center',
                                            mt: 2,
                                            gap: { xs: 0.5, sm: 1 },
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        <IconButton
                                            onClick={() => handleLike(post._id)}
                                            color="primary"
                                            sx={{
                                                fontFamily: 'Lora, serif',
                                                fontSize: { xs: '0.8rem', md: '1rem' },
                                                padding: { xs: '5px', sm: '8px' },
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <ThumbUpIcon
                                                sx={{
                                                    color: post.liked.some(like => like.email === user?.email) ? '#1F618D' : '#999',
                                                }}
                                            />
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontFamily: 'Lora, serif',
                                                    fontSize: { xs: '0.8rem', sm: '1rem' },
                                                    marginLeft: '4px',
                                                }}
                                            >
                                                {post.liked.length}
                                            </Typography>
                                        </IconButton>
                                        <Button
                                            onClick={() => handleOpenReviewDialog(post)}
                                            variant="outlined"
                                            color="primary"
                                            sx={{
                                                fontFamily: 'Lora, serif',
                                                fontSize: { xs: '0.75rem', md: '0.875rem' },
                                                padding: { xs: '4px 8px', sm: '6px 12px' },
                                                ml: { xs: 0, sm: 1 },
                                            }}
                                        >
                                            Leave a Review
                                        </Button>
                                        <Link href="/book" passHref>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                sx={{
                                                    background: 'linear-gradient(45deg, #3A539B 30%, #1F618D 90%)',
                                                    fontFamily: 'Lora, serif',
                                                    color: '#fff',
                                                    fontSize: { xs: '0.75rem', md: '1rem' },
                                                    padding: { xs: '4px 8px', sm: '6px 16px' },
                                                    ml: { xs: 0, sm: 1 },
                                                    '&:hover': {
                                                        background: 'linear-gradient(45deg, #1F618D 30%, #154360 90%)',
                                                    },
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
            )}
            {/* Review Dialog */}
            <Dialog open={open} onClose={handleCloseReviewDialog}>
                <DialogTitle sx={{ fontFamily: 'Lora, serif' }}>Leave a Review</DialogTitle>
                <DialogContent sx={{
                    width: { xs: '90%', sm: '500px', md: '600px' },
                    maxWidth: '100%',
                    margin: '0 auto',
                }}>
                    <TextField
                        label="Review"
                        multiline
                        rows={4}
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        fullWidth
                        sx={{ fontFamily: 'Lora, serif', marginTop: 1, }}
                        InputLabelProps={{
                            sx: {
                                fontFamily: 'Lora, serif',
                            },
                        }}
                        inputProps={{
                            sx: {
                                fontFamily: 'Lora, serif',
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseReviewDialog} color="error" sx={{ fontFamily: 'Lora, serif' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmitReview} variant="contained" color="primary" sx={{
                        background: "linear-gradient(45deg, #3A539B 30%, #1F618D 90%)",
                        fontFamily: "Lora, Serif",
                        color: "#fff",
                        transition: "background 0.3s",
                        '&:hover': {
                            background: "linear-gradient(45deg, #1F618D 30%, #154360 90%)"
                        }
                    }}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar Alert for Success or Error */}
            <Snackbar
                open={alertOpen}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseAlert}
                    severity={alertType}
                    sx={{ width: "100%" }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CategoryPostUI;