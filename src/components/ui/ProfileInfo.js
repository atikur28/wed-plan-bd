"use client";

import { Box, CircularProgress, Avatar, IconButton, Button, Snackbar, Alert } from "@mui/material";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import PersonIcon from "@mui/icons-material/Person";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import EditIcon from '@mui/icons-material/Edit';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const ProfileInfo = ({ uploadData }) => {
    const [profile, setProfile] = useState(null);
    const [providerProfile, setProviderProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("success");

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertOpen(false);
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileResponse = await fetch("http://localhost:3013/api/users/profile", {
                    method: "POST",
                    credentials: "include",
                });
                const profileData = await profileResponse.json();

                const email = profileData.result.email;

                if (profileData.success) {
                    // User info setup
                    const usersResponse = await fetch("http://localhost:3013/api/users", {
                        method: "GET",
                        credentials: "include",
                    });
                    const usersData = await usersResponse.json();

                    if (usersData.success) {
                        const user = usersData.result.find((u) => u.email === email);
                        if (user) {
                            setProfile(user);
                        } else {
                            console.log("User not found with this email");
                        }
                    } else {
                        console.log("Failed to fetch users");
                    }

                    // Provider info setup
                    const providersResponse = await fetch("http://localhost:3013/api/providers", {
                        method: "GET",
                        credentials: "include",
                    });
                    const providerData = await providersResponse.json();
                    if (providerData.success) {
                        const provider = providerData.result.find((p) => p.email === email);
                        if (provider) {
                            setProviderProfile(provider);
                        } else {
                            console.log("Provider not found with this email");
                        }
                    } else {
                        console.log("Failed to fetch providers");
                    }
                } else {
                    console.log("Profile not found");
                }
            } catch (err) {
                console.log("Failed to fetch profile or users", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(URL.createObjectURL(file));
            setImageFile(file);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleImageSubmit = async () => {
        if (!imageFile) return;

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", uploadData.IMAGE_UPLOAD_PRESET);
        formData.append("folder", uploadData.IMAGE_UPLOAD_FOLDER);

        try {
            setUploading(true);
            const response = await fetch(uploadData.IMAGE_UPLOAD_URL, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.url) {
                console.log("Image uploaded successfully");

                const updatedProfileData = {
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    image: data.url,
                    email: profile.email,
                    userCategory: profile.userCategory,
                    status: profile.status,
                };

                const updateResponse = await fetch("http://localhost:3013/api/users/profile/update-profile", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedProfileData),
                });

                const updateResult = await updateResponse.json();
                if (updateResult.success) {
                    setProfile((prevProfile) => ({
                        ...prevProfile,
                        image: data.url,
                    }));
                    setAlertMessage("Profile updated successfully!");
                    setAlertType("success");
                    setAlertOpen(true);
                } else {
                    console.log("Failed to update profile");
                    setAlertMessage("Failed to update profile.");
                    setAlertType("error");
                    setAlertOpen(true);
                }
            } else {
                console.log("Failed to upload image to Cloudinary");
                setAlertMessage("Failed to upload image.");
                setAlertType("error");
                setAlertOpen(true);
            }
        } catch (err) {
            console.log("Error uploading image or updating profile", err);
            setAlertMessage("Error uploading image or updating profile.");
            setAlertType("error");
            setAlertOpen(true);
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <Box className="mt-8 flex justify-center items-center h-[50vh]">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box className="flex flex-col md:flex-row justify-center gap-[2%] px-2 md:px-8 pb-2">
            {/* First Section: Profile Info */}
            <section className="md:w-[40%] lg:w-[35%] 3xl:w-[700px] flex flex-col justify-center items-center gap-4 bg-slate-50 md:pt-6 md:pb-8 rounded-lg">
                {/* Profile image changing process and showing updated image */}
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "15px",
                    height: "100%"
                }}>
                    {selectedImage ? (
                        <Image
                            src={selectedImage}
                            alt={`${profile?.firstName} ${profile?.lastName}`}
                            height={300}
                            width={300}
                            style={{
                                borderRadius: '50%',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                cursor: 'pointer',
                            }}
                            onClick={handleAvatarClick}
                        />
                    ) : profile?.image ? (
                        <Image
                            src={profile.image}
                            alt={`${profile.firstName} ${profile.lastName}`}
                            height={300}
                            width={300}
                            style={{
                                borderRadius: '50%',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                cursor: 'pointer',
                            }}
                            onClick={handleAvatarClick}
                        />
                    ) : (
                        <Avatar
                            sx={{
                                width: 300,
                                height: 300,
                                fontSize: 64,
                                background: "linear-gradient(135deg, #e66465, #9198e5)",
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "2px solid #293245",
                                cursor: 'pointer',
                                position: 'relative',
                            }}
                            onClick={handleAvatarClick}
                        >
                            <PersonIcon sx={{ fontSize: 120 }} />
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    bottom: 8,
                                    right: 8,
                                    backgroundColor: '#fff',
                                }}
                            >
                                <PhotoCamera />
                            </IconButton>
                        </Avatar>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleImageSubmit}
                        disabled={!selectedImage || uploading}
                        sx={{
                            backgroundColor: "#d3d3d3",
                            color: "#333",
                            "&:hover": {
                                backgroundColor: "#b0b0b0",
                            },
                            borderRadius: "6px",
                            padding: "4px 8px",
                            textTransform: "none",
                            fontFamily: "'Lora', serif",
                            fontWeight: "bold",
                            fontSize: "12px",
                            width: "fit-content",
                        }}
                    >
                        {uploading ? "Uploading..." : "Change Image"}
                    </Button>
                </Box>

                {/* Provider's name showing and updating in both users and providers database */}
                <Box className="flex">
                    <h4 className="text-2xl font-lora font-semibold">{providerProfile.name}</h4>
                    <p className="text-sm font-lora font-semibold text-blue-600 flex justify-start items-center gap-0.5 hover:cursor-pointer ml-5">Edit <EditIcon sx={{ fontSize: "15px" }} /></p>
                </Box>

                {/* Provider's profession name showing and updating in providers database */}
                <Box className="flex">
                    <h4 className="font-lora font-semibold">{providerProfile.professionName}</h4>
                    <p className="text-sm font-lora font-medium text-blue-600 flex justify-start items-center gap-0.5 hover:cursor-pointer ml-5">Edit <EditIcon sx={{ fontSize: "15px" }} /></p>
                </Box>

                {/* Provider's bio showing and updating in providers database */}
                {providerProfile.bio ? (
                    <Box>
                        <section><ArrowDropDownIcon sx={{ fontSize: "50px", color: "orange" }} /><ArrowDropDownIcon sx={{ fontSize: "50px", color: "orange" }} /></section>
                        <p className="font-lora font-semibold text-center">{providerProfile.bio}</p>
                    </Box>
                ) : (
                    <Box className="flex flex-col justify-center items-center">
                        <section><ArrowDropDownIcon sx={{ fontSize: "50px", color: "orange" }} /><ArrowDropDownIcon sx={{ fontSize: "50px", color: "orange" }} /></section>
                        <p className="bg-gray-200 font-lora font-semibold px-5 py-1 rounded-md border-2 border-gray-400 hover:bg-gray-300 hover:cursor-pointer active:bg-gray-400 active:border-gray-500 active:shadow-inner transition-all duration-200 ease-in-out active:scale-95 w-max mx-auto select-none">Write your bio</p>
                    </Box>
                )}

                {/*  */}
            </section>

            {/* Second Section */}
            <section className="md:w-[58%] lg:w-[73%] 3xl:w-[1400px]">

            </section>

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

export default ProfileInfo;
