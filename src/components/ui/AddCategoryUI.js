"use client";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const AddCategoryUI = ({ uploadData }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        image: null,
        pathName: "",
    });

    // Alert state
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("success");

    const handleCloseAlert = (event, reason) => {
        if (reason === "clickaway") return;
        setAlertOpen(false);
    };

    // Fetch existing categories
    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:3026/api/categories", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();

                if (data.success) {
                    setCategories(data.result);
                } else {
                    console.log("Categories not found");
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Handle form input changes
    const handleChange = (event) => {
        const { name, value, files } = event.target;
        if (name === "image") {
            setFormData((prevData) => ({ ...prevData, image: files[0] }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.image) {
            setAlertMessage("Please upload an image for the category!");
            setAlertType("error");
            setAlertOpen(true);
            return;
        }

        // Prepare image data
        const imageData = new FormData();
        imageData.append("file", formData.image);
        imageData.append("upload_preset", uploadData.IMAGE_UPLOAD_PRESET);
        imageData.append("folder", uploadData.IMAGE_UPLOAD_FOLDER);

        try {
            setLoading(true);

            // Upload image to Cloudinary
            const response = await fetch(uploadData.IMAGE_UPLOAD_URL, {
                method: "POST",
                body: imageData,
            });
            const data = await response.json();

            if (data.url) {
                // Post new category data
                const newCategory = {
                    name: formData.name,
                    image: data.url,
                    pathName: formData.pathName,
                };

                const categoryResponse = await fetch("http://localhost:3026/api/categories/add-category", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newCategory),
                });

                const result = await categoryResponse.json();

                if (result.success) {
                    setAlertMessage("Category created successfully!");
                    setAlertType("success");
                    setFormData({ name: "", image: null, pathName: "" });
                } else {
                    setAlertMessage("Failed to create category!");
                    setAlertType("error");
                }
            } else {
                setAlertMessage("Failed to upload image!");
                setAlertType("error");
            }
        } catch (error) {
            console.error("Error:", error);
            setAlertMessage("Error creating category!");
            setAlertType("error");
        } finally {
            setLoading(false);
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
        <Box>
            <Box mb={6}>
                <h2 className="text-lg md:text-xl lg:text-2xl font-lora font-semibold mt-5 mb-2">Add New Category</h2>

                <p className="text-sm lg:text-base text-justify text-gray-700 font-lora mb-10">
                    Welcome to the category creation page! Here, you can add a new category to organize the services available on our platform.
                    Filling out each section with accurate information helps users browse and discover the services they’re looking for. <br /> <br />

                    Start by entering the category name, such as &quot;Photographers&quot; or &quot;Decorators.&quot;
                    Then, provide a short path name of the category to help clients understand what type of services are included to do routing. <br /> <br />

                    Finally, add an image that represents the category, enhancing the visual appeal of the platform.
                    This image will appear on the category selection page, giving clients a clear idea of what to expect.
                </p>

                <Grid container spacing={4}>
                    {[
                        { title: "Category ID", description: "Auto-generated after submission." },
                        { title: "Category Name", description: "Enter the category name (e.g., 'Photographers')." },
                        { title: "Image URL", description: "Provide the image URL for this category." },
                        { title: "Path Name", description: "Specify a unique pathname for routing." },
                    ].map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card className="shadow-md hover:shadow-lg transition-all py-5 min-h-full">
                                <CardContent>
                                    <Typography variant="h6" component="h4" sx={{ fontFamily: "Lora, serif" }}>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ fontFamily: "Lora, serif" }}>
                                        {item.description}
                                    </Typography>
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
                    maxWidth: 800,
                    mx: "auto",
                    backgroundColor: "#f5f5f5",
                    borderRadius: 2,
                    boxShadow: 3,
                    fontFamily: "Lora, serif",
                }}
            >
                <Typography variant="h4" component="h2" sx={{ mb: 3, fontFamily: "Lora, serif", fontWeight: 600 }}>
                    Add Now
                </Typography>

                {/* Form Fields */}
                <Box className="flex flex-col lg:flex-row justify-between items-center lg:gap-5">
                    <TextField
                        type="file"
                        name="image"
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
                        label="Path Name"
                        name="pathName"
                        value={formData.pathName}
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

                <TextField
                    label="Category Name"
                    name="name"
                    value={formData.name}
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
                    Submit Category
                </Button>
            </Box>

            {/* Alert Snackbar */}
            <Snackbar
                open={alertOpen}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleCloseAlert} severity={alertType} sx={{ width: "100%" }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AddCategoryUI;