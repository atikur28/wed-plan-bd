"use client";

import { Alert, Box, Button, Card, CardContent, CircularProgress, Grid, Snackbar, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const AddPostForm = ({ uploadData }) => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        serviceName: "",
        provider: "",
        serviceImage: null,
        email: "",
        number: "",
        price: "",
        location: "",
        availableDays: "",
        description: ""
    });
    const [days, setDays] = useState('');

    // Alert Code:
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("success");

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertOpen(false);
    };

    // Fetch user information on component mount
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const profileResponse = await fetch("http://localhost:3026/api/users/profile", {
                    method: "POST",
                    credentials: "include",
                });
                const profileData = await profileResponse.json();

                if (profileData.success) {
                    const email = profileData.result.email;
                    const userResponse = await fetch("http://localhost:3026/api/users/get-user", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email }),
                    });
                    const userData = await userResponse.json();

                    if (userData.status) {
                        setUser(userData.data);
                        setFormData((prevData) => ({
                            ...prevData,
                            provider: userData.data.name,
                            email: userData.data.email,
                        }));
                    } else {
                        console.log("User not found");
                    }
                } else {
                    console.log("Profile not found");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // Handle form field changes
    const handleChange = (event) => {
        const { name, value, files } = event.target;
        if (name === "serviceImage") {
            setFormData((prevData) => ({ ...prevData, serviceImage: files[0] }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.serviceImage) return;

        const imageData = new FormData();
        imageData.append("file", formData.serviceImage);
        imageData.append("upload_preset", uploadData.IMAGE_UPLOAD_PRESET);
        imageData.append("folder", uploadData.IMAGE_UPLOAD_FOLDER);

        try {
            const postsResponse = await fetch("http://localhost:3026/api/posts", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const postData = await postsResponse.json();
            const userPosts = postData.result.filter((post) => post.email === user?.email);

            if (userPosts.length >= 5) {
                setAlertMessage("You cannot post more than five times!");
                setAlertType("error");
                setAlertOpen(true);
                return;
            }

            setLoading(true);

            const response = await fetch(uploadData.IMAGE_UPLOAD_URL, {
                method: "POST",
                body: imageData,
            });

            const data = await response.json();

            if (data.url) {
                console.log("Image uploaded successfully");

                const newPostData = {
                    serviceName: formData.serviceName,
                    provider: formData.provider,
                    serviceImage: data.url,
                    email: formData.email,
                    status: user?.userCategory,
                    professionName: user?.professionName,
                    number: formData.number,
                    price: formData.price,
                    location: formData.location,
                    availableDays: formData.availableDays,
                    description: formData.description,
                    days: days
                };

                const updateResponse = await fetch("http://localhost:3026/api/posts/provider-post", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newPostData),
                });

                const updateResult = await updateResponse.json();
                if (updateResult.success) {
                    setAlertMessage("Post created successfully!");
                    setAlertType("success");
                    setAlertOpen(true);

                    setFormData({
                        serviceName: "",
                        provider: formData.provider,
                        serviceImage: null,
                        email: formData.email,
                        number: "",
                        price: "",
                        location: "",
                        availableDays: "",
                        description: "",
                    });
                    setDays("");
                } else {
                    console.log("Failed to create post!");
                    setAlertMessage("Failed to create post!");
                    setAlertType("error");
                    setAlertOpen(true);
                }
            } else {
                console.log("Failed to upload image to Cloudinary.");
                setAlertMessage("Failed to upload image!");
                setAlertType("error");
                setAlertOpen(true);
            }
        } catch (error) {
            console.log("Error uploading image or posting service: ", error);
            setAlertMessage("Error posting service!");
            setAlertType("error");
            setAlertOpen(true);
        } finally {
            setLoading(false);
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
        <>
            <Box mb={6}>
                <h2 className="text-lg md:text-xl lg:text-2xl font-lora font-semibold mt-5 mb-2">Add New Post</h2>

                <p className="text-sm lg:text-base text-justify text-gray-700 font-lora mb-10">
                    Welcome to the post creation page! Here, you have the opportunity to add a new service to our platform, showcasing what you have to offer to clients seeking quality wedding and event services.
                    Providing detailed information in each section will help users find your service, understand its unique features, and make informed decisions. Remember, you can&apos;t post more than 5 times. <br /> <br />

                    Begin by adding the name of your service, such as &quot;Elegant Floral Decorations&quot; or &quot;Professional Event Photography.&quot; Then, proceed to include your business or provider details to build trust with potential clients.
                    Don&apos;t forget to include pricing information and specify your primary location, as these factors help users filter and choose services that meet their needs. <br /> <br />

                    An attractive image upload can enhance your listing by giving clients a visual sense of what you offer. Once you&apos;re ready, submit the form and bring your service closer to those looking for it on our platform!
                </p>

                <Grid container spacing={4}>
                    {[
                        { title: "Service Name", description: "Enter the name of your service (e.g., 'Premium Wedding Photography')." },
                        { title: "Provider Information", description: "Provide the name or business name of the service provider, along with a brief description if applicable." },
                        { title: "Pricing", description: "Add the price for your service, if applicable. Include currency and any additional pricing details users might need." },
                        { title: "Location", description: "Specify the primary location where your service is available. This helps users filter by location." },
                        { title: "Image Upload", description: "Add an image that best represents your service. Accepted formats: JPG, PNG. Please make sure the image size is under 5 MB." },
                    ].map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card className="shadow-md hover:shadow-lg transition-all py-5 min-h-full flex flex-col justify-between">
                                <CardContent className="flex-grow">
                                    <h4 className="lg:text-lg font-lora font-semibold mb-2">{item.title}</h4>
                                    <p className="text-sm lg:text-[14px] font-lora text-gray-500">{item.description}</p>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    p: 4,
                    maxWidth: 1000,
                    margin: "0 auto",
                    backgroundColor: "#f5f5f5",
                    borderRadius: 2,
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: "column",
                    fontFamily: "Lora, serif",
                }}
            >
                <Typography variant="h4" component="h3" sx={{ mb: 4, fontFamily: "Lora, serif", fontWeight: 600 }}>
                    Add Now
                </Typography>

                {/* Image and Service Name */}
                <Box className="flex flex-col lg:flex-row justify-between items-center lg:gap-5">
                    <TextField
                        type="file"
                        name="serviceImage"
                        onChange={handleChange}
                        fullWidth
                        required
                        variant="outlined"
                        sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "15px",
                                borderColor: "#ccc",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                "&:hover": {
                                    borderColor: "#6200ea",
                                },
                                "&.Mui-focused": {
                                    borderColor: "#6200ea",
                                    boxShadow: "0px 4px 12px rgba(98, 0, 234, 0.2)",
                                },
                                padding: "10px",
                                fontFamily: "Lora, serif",
                            },
                            "& .MuiInputLabel-root": {
                                fontFamily: "Lora, serif",
                            },
                        }}
                    />
                    <TextField
                        label="Service Name"
                        name="serviceName"
                        value={formData.serviceName}
                        onChange={handleChange}
                        fullWidth
                        required
                        variant="outlined"
                        sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "15px",
                                borderColor: "#ccc",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                backgroundColor: "#fff",
                                padding: "10px",
                                "&:hover": {
                                    borderColor: "#6200ea",
                                },
                                "&.Mui-focused": {
                                    borderColor: "#6200ea",
                                    boxShadow: "0px 4px 12px rgba(98, 0, 234, 0.2)",
                                },
                                fontFamily: "Lora, serif",
                            },
                            "& .MuiInputLabel-root": {
                                fontFamily: "Lora, serif",
                            },
                        }}
                    />
                </Box>

                {/* Provider Name and Email */}
                <Box className="flex flex-col lg:flex-row justify-between items-center lg:gap-5">
                    <TextField
                        label="Provider"
                        name="provider"
                        value={formData.provider}
                        onChange={handleChange}
                        fullWidth
                        required
                        disabled
                        variant="outlined"
                        sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "15px",
                                borderColor: "#ccc",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                backgroundColor: "#fff",
                                padding: "10px",
                                "&:hover": {
                                    borderColor: "#6200ea",
                                },
                                "&.Mui-focused": {
                                    borderColor: "#6200ea",
                                    boxShadow: "0px 4px 12px rgba(98, 0, 234, 0.2)",
                                },
                                fontFamily: "Lora, serif",
                            },
                            "& .MuiInputLabel-root": {
                                fontFamily: "Lora, serif",
                            },
                        }}
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        type="email"
                        required
                        disabled
                        variant="outlined"
                        sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "15px",
                                borderColor: "#ccc",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                backgroundColor: "#fff",
                                padding: "10px",
                                "&:hover": {
                                    borderColor: "#6200ea",
                                },
                                "&.Mui-focused": {
                                    borderColor: "#6200ea",
                                    boxShadow: "0px 4px 12px rgba(98, 0, 234, 0.2)",
                                },
                                fontFamily: "Lora, serif",
                            },
                            "& .MuiInputLabel-root": {
                                fontFamily: "Lora, serif",
                            },
                        }}
                    />
                </Box>

                {/* Contact Number and Price */}
                <Box className="flex flex-col lg:flex-row justify-between items-center lg:gap-5">
                    <TextField
                        label="Contact Number"
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                        fullWidth
                        type="number"
                        required
                        variant="outlined"
                        sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "15px",
                                borderColor: "#ccc",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                backgroundColor: "#fff",
                                padding: "10px",
                                "&:hover": {
                                    borderColor: "#6200ea",
                                },
                                "&.Mui-focused": {
                                    borderColor: "#6200ea",
                                    boxShadow: "0px 4px 12px rgba(98, 0, 234, 0.2)",
                                },
                                fontFamily: "Lora, serif",
                            },
                            "& .MuiInputLabel-root": {
                                fontFamily: "Lora, serif",
                            },
                        }}
                    />
                    <TextField
                        label="Price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        fullWidth
                        type="number"
                        required
                        variant="outlined"
                        sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "15px",
                                borderColor: "#ccc",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                backgroundColor: "#fff",
                                padding: "10px",
                                "&:hover": {
                                    borderColor: "#6200ea",
                                },
                                "&.Mui-focused": {
                                    borderColor: "#6200ea",
                                    boxShadow: "0px 4px 12px rgba(98, 0, 234, 0.2)",
                                },
                                fontFamily: "Lora, serif",
                            },
                            "& .MuiInputLabel-root": {
                                fontFamily: "Lora, serif",
                            },
                        }}
                    />
                </Box>

                {/* Location and Available Days */}
                <Box className="flex flex-col lg:flex-row justify-between items-center lg:gap-5">
                    <TextField
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        fullWidth
                        required
                        variant="outlined"
                        sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "15px",
                                borderColor: "#ccc",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                backgroundColor: "#fff",
                                padding: "10px",
                                "&:hover": {
                                    borderColor: "#6200ea",
                                },
                                "&.Mui-focused": {
                                    borderColor: "#6200ea",
                                    boxShadow: "0px 4px 12px rgba(98, 0, 234, 0.2)",
                                },
                                fontFamily: "Lora, serif",
                            },
                            "& .MuiInputLabel-root": {
                                fontFamily: "Lora, serif",
                            },
                        }}
                    />
                    <TextField
                        label="Available Days (e.g. Mon-Sat)"
                        name="availableDays"
                        value={formData.availableDays}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "15px",
                                borderColor: "#ccc",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                backgroundColor: "#fff",
                                padding: "10px",
                                "&:hover": {
                                    borderColor: "#6200ea",
                                },
                                "&.Mui-focused": {
                                    borderColor: "#6200ea",
                                    boxShadow: "0px 4px 12px rgba(98, 0, 234, 0.2)",
                                },
                                fontFamily: "Lora, serif",
                            },
                            "& .MuiInputLabel-root": {
                                fontFamily: "Lora, serif",
                            },
                        }}
                    />
                </Box>

                {/* Description and Days */}
                <Box className="flex flex-col lg:flex-row justify-between items-center lg:gap-5">
                    <TextField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                        required
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "15px",
                                borderColor: "#ccc",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                backgroundColor: "#fff",
                                padding: "10px",
                                "&:hover": {
                                    borderColor: "#6200ea",
                                },
                                "&.Mui-focused": {
                                    borderColor: "#6200ea",
                                    boxShadow: "0px 4px 12px rgba(98, 0, 234, 0.2)",
                                },
                                fontFamily: "Lora, serif",
                            },
                            "& .MuiInputLabel-root": {
                                fontFamily: "Lora, serif",
                            },
                        }}
                    />
                    {user?.userCategory === "travel" && (
                        <TextField
                            label="Travel's day limit (e.g. 3 days)"
                            name="days"
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            sx={{
                                mb: 2,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "15px",
                                    borderColor: "#ccc",
                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                    backgroundColor: "#fff",
                                    padding: "10px",
                                    "&:hover": {
                                        borderColor: "#6200ea",
                                    },
                                    "&.Mui-focused": {
                                        borderColor: "#6200ea",
                                        boxShadow: "0px 4px 12px rgba(98, 0, 234, 0.2)",
                                    },
                                    fontFamily: "Lora, serif",
                                },
                                "& .MuiInputLabel-root": {
                                    fontFamily: "Lora, serif",
                                },
                            }}
                        />
                    )}
                </Box>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                        mt: 2,
                        fontSize: 14,
                        fontFamily: "Lora, serif",
                        backgroundColor: "#6200ea",
                        borderRadius: "15px",
                        padding: "12px 0",
                        "&:hover": {
                            backgroundColor: "#3700b3",
                        },
                    }}
                >
                    Submit Post
                </Button>
            </Box>
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
        </>
    );
};

export default AddPostForm;