"use client";

import SearchIcon from "@mui/icons-material/Search";
import { Alert, Box, Button, Card, CardContent, CardMedia, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, InputAdornment, Snackbar, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const AdminEventsUI = () => {
    const [allEvents, setAllEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Alert States
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("success");
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);

    useEffect(() => {
        const getEvents = async () => {
            try {
                setLoading(true);
                const res = await fetch("http://localhost:3026/api/posts");
                const data = await res.json();
                if (data.success) {
                    setAllEvents(data.result);
                }
            } catch (error) {
                console.log("Failed to fetch posts: ", error);
            } finally {
                setLoading(false);
            }
        }
        getEvents();
    }, []);

    // Alert handle code
    const handleCloseAlert = (event, reason) => {
        if (reason === "clickaway") return;
        setAlertOpen(false);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Filter events based on the search query
    const filteredEvents = allEvents.filter((event) => {
        const serviceNameMatch = event.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
        const postedMatch = event.posted.toLowerCase().includes(searchQuery.toLowerCase());
        return serviceNameMatch || postedMatch;
    });

    // Post's Approval code:
    const handleApproval = async (data) => {
        try {
            setLoading(true);

            const updatedData = {
                id: data._id,
                serviceName: data.serviceName,
                provider: data.provider,
                serviceImage: data.serviceImage,
                email: data.email,
                status: data.status,
                professionName: data.professionName,
                posted: "Approved",
                number: data.number,
                price: data.price,
                location: data.location,
                availableDays: data.availableDays,
                booked: data.booked,
                bookedFor: data.bookedFor,
                description: data.description,
                days: data.days,
                liked: data.liked,
                ratings: data.ratings,
                review: data.review
            };

            const response = await fetch("http://localhost:3026/api/posts/update-post", {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            const result = await response.json();

            if (result.success) {
                setAllEvents(prevEvents =>
                    prevEvents.map(event =>
                        event._id === data._id ? { ...event, posted: "Approved" } : event
                    )
                );
                setAlertMessage("Event approved successfully!");
                setAlertType("success");
            } else {
                setAlertMessage("Failed to approve the event.");
                setAlertType("error");
            }
            setAlertOpen(true);
        } catch (error) {
            console.error("Error:", error);
            setAlertMessage("An error occurred while approving the event.");
            setAlertType("error");
            setAlertOpen(true);
        } finally {
            setLoading(false);
        }
    };

    // Delete Posts code:
    const handleDeleteDialogOpen = (postId) => {
        setSelectedPostId(postId);
        setConfirmDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setConfirmDeleteDialogOpen(false);
        setSelectedPostId(null);
    };

    const handlePostDelete = async () => {
        if(selectedPostId) {
            try {
                setLoading(true);
                const response = await fetch("http://localhost:3026/api/posts/delete-post", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ postId: selectedPostId })
                });
                const result = await response.json();

                if (response.ok && result.success) {
                    setAlertMessage("Post deleted successfully!");
                    setAlertType("success");
                    setAlertOpen(true);

                    setAllEvents((prevPosts) => prevPosts.filter((post) => post._id !== selectedPostId));
                } else {
                    console.error("Failed to delete user:", result.message);
                    setAlertMessage("Failed to delete user!");
                    setAlertType("error");
                    setAlertOpen(true);
                }
            } catch (error) {
                console.error("Error deleting post:", error);
                setAlertMessage("Failed to delete post!");
                setAlertType("error");
                setAlertOpen(true);
            } finally {
                handleDeleteDialogClose();
                setLoading(false);
            }
        }
    }

    // Render loading state or user information
    if (loading) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
                <CircularProgress size={60} color="primary" />
                <Typography variant="h6" mt={2}>
                    Loading, please wait...
                </Typography>
            </Box>
        );
    }

    return (
        <Box className="mb-10">
            <h2 className="text-xl lg:text-2xl font-lora font-semibold text-gray-900 mt-2">Events dashboard</h2>
            <p className="text-sm lg:text-base font-lora font-medium text-gray-700 mt-2">
                Efficiently manage all wedding events from the dashboard. Here, admins can access and monitor events in detail, ensuring a smooth experience for clients and event teams.
            </p>

            <Box className="flex justify-between items-center md:mr-2 mt-5">
                <h4 className="lg:text-lg font-lora font-semibold text-gray-900">All posts ({filteredEvents.length})</h4>
                <TextField
                    placeholder="Service name/Pending/Approved"
                    variant="outlined"
                    className="w-[195px] md:w-[300px] font-lora"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon className="text-gray-500" />
                            </InputAdornment>
                        ),
                    }}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#E5E7EB',
                            },
                            '&:hover fieldset': {
                                borderColor: '#6B7280',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#3e98f2',
                            },
                            '& .MuiOutlinedInput-input': {
                                fontFamily: 'Lora, serif',
                                padding: '6px 6px',
                                '&::placeholder': {
                                    color: 'rgba(0, 0, 0, 0.5)',
                                    fontFamily: 'Lora, serif',
                                },
                            },
                        },
                        '& .MuiInputLabel-root': {
                            fontFamily: 'Lora, serif',
                            top: '-4px',
                        },
                        '& .MuiInputAdornment-root': {
                            fontFamily: 'Lora, serif',
                        }
                    }}
                />
            </Box>

            <Grid container spacing={3} mt={3}>
                {filteredEvents.map((event) => (
                    <Grid item xs={12} key={event._id}>
                        <Card
                            variant="outlined"
                            className="flex flex-col md:flex-row items-center p-4 shadow-md"
                            sx={{
                                borderColor: event.posted === "Pending" ? "#F87171" : "#10B981",
                                borderWidth: 2,
                                transition: "all 0.3s ease-in-out",
                                borderRadius: 2,
                                "&:hover": {
                                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
                                    transform: "scale(1.01)",
                                },
                            }}
                        >
                            <CardMedia
                                component="img"
                                src={event.serviceImage}
                                alt={event.serviceName}
                                className="rounded-md"
                                sx={{
                                    width: { xs: "100%", md: "120px" },
                                    height: { xs: "200px", md: "100px" },
                                    objectFit: "cover",
                                    mr: { md: 3 },
                                }}
                            />
                            <CardContent className="flex flex-col flex-grow" sx={{ fontFamily: 'Lora, serif' }}>
                                <Box className="flex justify-between items-center">
                                    <Typography variant="h6" sx={{ fontWeight: "bold", fontFamily: 'Lora, serif' }}>
                                        {event.serviceName}
                                    </Typography>
                                    {event.posted === "Pending" && (
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontWeight: "bold",
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                                bgcolor: "#FEE2E2",
                                                color: "#EF4444",
                                                cursor: "pointer",
                                                fontFamily: 'Lora, serif',
                                            }}
                                            onClick={() => handleApproval(event)}
                                        >
                                            {event.posted}
                                        </Typography>
                                    )}
                                    {event.posted === "Approved" && (
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontWeight: "bold",
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                                bgcolor: "#D1FAE5",
                                                color: "#10B981",
                                                fontFamily: 'Lora, serif',
                                            }}
                                        >
                                            {event.posted}
                                        </Typography>
                                    )}
                                </Box>
                                <Typography variant="body2" sx={{ mt: 1, fontFamily: 'Lora, serif' }}>
                                    Provider: <span style={{ fontWeight: "bold" }}>{event.provider}</span>
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1, fontFamily: 'Lora, serif' }}>
                                    Price: <span style={{ fontWeight: "bold" }}>৳{event.price}</span>
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1, fontFamily: 'Lora, serif' }}>
                                    Location: <span style={{ fontWeight: "bold" }}>{event.location}</span>
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1, fontFamily: 'Lora, serif' }}>
                                    Available Days: <span style={{ fontWeight: "bold" }}>{event.availableDays}</span>
                                </Typography>
                                <Box mt={2} className="flex gap-2">
                                    <Button variant="outlined" color="error" size="small" sx={{ fontFamily: 'Lora, serif' }} onClick={() => handleDeleteDialogOpen(event._id)}>
                                        Delete
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Snackbar open={alertOpen} autoHideDuration={3000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity={alertType} sx={{ width: "100%" }}>
                    {alertMessage}
                </Alert>
            </Snackbar>

            <Dialog open={confirmDeleteDialogOpen} onClose={handleDeleteDialogClose}>
                <DialogTitle sx={{ fontFamily: "Lora, serif" }}>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontFamily: "Lora, serif" }}>
                        Are you sure you want to delete this post? This action is irreversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose} color="primary" sx={{ fontFamily: "Lora, serif" }}>
                        Cancel
                    </Button>
                    <Button onClick={handlePostDelete} color="error" sx={{ fontFamily: "Lora, serif" }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminEventsUI;