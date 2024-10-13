"use client";

import { Box, CircularProgress, Avatar, Typography, IconButton, Button } from "@mui/material";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import PersonIcon from "@mui/icons-material/Person";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const ProfileInfo = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch("http://localhost:3012/api/users/profile", {
                    method: "POST",
                    credentials: "include",
                });

                const data = await response.json();

                if (data.success) {
                    setProfile(data.result);
                } else {
                    console.log(data.message);
                }
            } catch (err) {
                console.log("Failed to fetch profile");
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
        formData.append("image", imageFile);

        try {
            setUploading(true);
            const response = await fetch("http://localhost:3012/api/users/upload-image", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                console.log("Image uploaded successfully");
                setProfile((prevProfile) => ({
                    ...prevProfile,
                    image: data.imageUrl,
                }));
            } else {
                console.log(data.message);
            }
        } catch (err) {
            console.log("Failed to upload image");
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
        <Box className="flex flex-col md:flex-row justify-center gap-[2%] px-2 md:px-8 md:pt-6 pb-2 md:pb-8">
            {/* First Section: Profile Info */}
            <section className="md:w-[40%] lg:w-[35%] 3xl:w-[700px] flex flex-col justify-center items-center gap-4">
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
                    color="#"
                    onClick={handleImageSubmit}
                    disabled={!selectedImage || uploading}
                    sx={{
                        backgroundColor: "#d3d3d3",
                        color: "#333",
                        "&:hover": {
                            backgroundColor: "#b0b0b0",
                        },
                        borderRadius: "8px",
                        padding: "10px 20px",
                        textTransform: "none",
                        fontWeight: "bold",
                        fontSize: "16px"
                    }}
                >
                    {uploading ? "Uploading..." : "Change Image"}
                </Button>
            </section>

            {/* Second Section */}
            <section className="md:w-[58%] lg:w-[73%] 3xl:w-[1400px]">
                
            </section>
        </Box>
    );
};

export default ProfileInfo;
