"use client";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PersonIcon from "@mui/icons-material/Person";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { Alert, Avatar, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Snackbar, TextField } from "@mui/material";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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

    const [nameDialogOpen, setNameDialogOpen] = useState(false);
    const [professionDialogOpen, setProfessionDialogOpen] = useState(false);
    const [bioDialogOpen, setBioDialogOpen] = useState(false);

    // Alert Code:
    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertOpen(false);
    };

    // Profile & Provider Profile Get Code:
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

    // Image Uploading Process:
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

    // Name Changing Code:
    const handleNameOpen = () => {
        setNameDialogOpen(true);
    };

    const handleNameClose = () => {
        setNameDialogOpen(false);
    };

    const handleNameChange = async (name) => {
        try {
            setLoading(true);
            if (name.length > 31) {
                setAlertMessage("Name should be in 30 letter!");
                setAlertType("error");
                setAlertOpen(true);
            } else {
                const updatedNameData = {
                    name: name,
                    professionImage: providerProfile.professionImage,
                    email: providerProfile.email,
                    cost: providerProfile.cost,
                    age: providerProfile.age,
                    address: providerProfile.address,
                    status: providerProfile.status,
                    professionName: providerProfile.professionName,
                    photos: providerProfile.photos,
                    videos: providerProfile.videos,
                    bio: providerProfile.bio,
                    additionalInfo: providerProfile.additionalInfo,
                    popularity: providerProfile.popularity
                };

                const response = await fetch("http://localhost:3013/api/providers/update-provider", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedNameData),
                });

                const updatedResult = await response.json();
                if (updatedResult.success) {
                    setProviderProfile((prevProfile) => ({
                        ...prevProfile,
                        name: name,
                    }));
                    setAlertMessage("Name saved successfully!");
                    setAlertType("success");
                    setAlertOpen(true);
                } else {
                    console.log("Failed to save name");
                    setAlertMessage("Failed to save name.");
                    setAlertType("error");
                    setAlertOpen(true);
                }
            }
        } catch (error) {
            console.log("Error saving profile's name", error);
            setAlertMessage("Error saving profile's name.");
            setAlertType("error");
            setAlertOpen(true);
        } finally {
            setLoading(false);
        }
    };

    // Bio Add & Changing Code:
    const handleBioOpen = () => {
        setBioDialogOpen(true);
    };

    const handleBioClose = () => {
        setBioDialogOpen(false);
    };

    const handleBioChange = async (bio) => {
        try {
            setLoading(true);
            if (bio.length > 206) {
                setAlertMessage("Bio message should be in 205 letter!");
                setAlertType("error");
                setAlertOpen(true);
            } else {
                const updatedBioData = {
                    name: providerProfile.name,
                    professionImage: providerProfile.professionImage,
                    email: providerProfile.email,
                    cost: providerProfile.cost,
                    age: providerProfile.age,
                    address: providerProfile.address,
                    status: providerProfile.status,
                    professionName: providerProfile.professionName,
                    photos: providerProfile.photos,
                    videos: providerProfile.videos,
                    bio: bio,
                    additionalInfo: providerProfile.additionalInfo,
                    popularity: providerProfile.popularity
                };

                const response = await fetch("http://localhost:3013/api/providers/update-provider", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedBioData),
                });

                const updatedResult = await response.json();
                if (updatedResult.success) {
                    setProviderProfile((prevProfile) => ({
                        ...prevProfile,
                        bio: bio,
                    }));
                    setAlertMessage("Bio saved successfully!");
                    setAlertType("success");
                    setAlertOpen(true);
                } else {
                    console.log("Failed to save bio");
                    setAlertMessage("Failed to save bio.");
                    setAlertType("error");
                    setAlertOpen(true);
                }
            }
        } catch (error) {
            console.log("Error saving profile's bio", error);
            setAlertMessage("Error saving profile's bio.");
            setAlertType("error");
            setAlertOpen(true);
        } finally {
            setLoading(false);
        }
    }

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
                <Box className="flex justify-center items-center">
                    <h4 className="text-2xl font-lora font-semibold">{providerProfile.name}</h4>
                    <section>
                        <p className="text-sm font-lora font-semibold text-blue-600 flex justify-start items-center gap-0.5 hover:cursor-pointer ml-5" onClick={handleNameOpen}>Edit..</p>

                        {/* Dialog */}
                        <Dialog
                            open={nameDialogOpen}
                            onClose={handleNameClose}
                            PaperProps={{
                                component: 'form',
                                onSubmit: (event) => {
                                    event.preventDefault();
                                    const formData = new FormData(event.currentTarget);
                                    const formJson = Object.fromEntries(formData.entries());
                                    const name = formJson.name;
                                    handleNameChange(name);
                                    handleNameClose();
                                },
                            }}
                        >
                            <DialogTitle sx={{ fontFamily: 'Lora, serif' }}>Add Your Profile&apos;s Name</DialogTitle>
                            <DialogContent>
                                <DialogContentText sx={{ fontFamily: 'Lora, serif' }}>
                                    Please enter your name and share your role or involvement in the wedding industry or event.
                                </DialogContentText>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <AccountCircleIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                    <TextField
                                        autoFocus
                                        required
                                        margin="dense"
                                        id="name"
                                        name="name"
                                        label="Write your name"
                                        type="text"
                                        fullWidth
                                        variant="standard"
                                        InputLabelProps={{
                                            sx: {
                                                fontFamily: 'Lora, serif',
                                                '&.Mui-focused': {
                                                    color: '#06b6d4',
                                                },
                                            },
                                        }}
                                        InputProps={{
                                            sx: {
                                                fontFamily: 'Lora, serif',
                                                '&:after': {
                                                    borderBottomColor: '#06b6d4',
                                                },
                                            },
                                        }}
                                    />
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <p
                                    className="px-2 py-0.5 bg-red-200 rounded font-lora font-medium border border-red-400 hover:cursor-pointer active:bg-red-100 active:border-red-300 active:shadow-inner transition-all duration-200 ease-in-out active:scale-75 select-none"
                                    onClick={handleNameClose}
                                >
                                    Cancel
                                </p>
                                <button
                                    type="submit"
                                    className="text-white px-2 py-0.5 bg-cyan-500 rounded font-lora font-medium border border-cyan-600 hover:cursor-pointer active:bg-cyan-400 active:border-cyan-600 active:shadow-inner transition-all duration-200 ease-in-out active:scale-75 select-none"
                                >
                                    Save Name
                                </button>
                            </DialogActions>
                        </Dialog>
                    </section>
                </Box>

                {/* Provider's profession name showing and updating in providers database */}
                    <h4 className="font-lora font-semibold text-center">{providerProfile.professionName}</h4>

                {/* Provider's bio showing and updating in providers database */}
                {providerProfile.bio ? (
                    <Box className="flex flex-col justify-center items-center">
                        <section><ArrowDropDownIcon sx={{ fontSize: "50px", color: "orange" }} /><ArrowDropDownIcon sx={{ fontSize: "50px", color: "orange" }} /></section>
                        <section>
                            <p className="font-lora font-semibold text-center px-2">{providerProfile.bio} <span className="ml-2 text-sm text-blue-600 hover:cursor-pointer" onClick={handleBioOpen}>Edit..</span></p>

                            {/* Dialog */}
                            <Dialog
                                open={bioDialogOpen}
                                onClose={handleBioClose}
                                PaperProps={{
                                    component: 'form',
                                    onSubmit: (event) => {
                                        event.preventDefault();
                                        const formData = new FormData(event.currentTarget);
                                        const formJson = Object.fromEntries(formData.entries());
                                        const bio = formJson.bio;
                                        handleBioChange(bio);
                                        handleBioClose();
                                    },
                                }}
                            >
                                <DialogTitle sx={{ fontFamily: 'Lora, serif' }}>Add Your Profile&apos;s Bio</DialogTitle>
                                <DialogContent>
                                    <DialogContentText sx={{ fontFamily: 'Lora, serif' }}>
                                        Please enter a brief bio to display on your profile. Share your experience,
                                        passions, and role in the wedding industry or how you are involved in the event.
                                    </DialogContentText>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <AccountCircleIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                        <TextField
                                            autoFocus
                                            required
                                            margin="dense"
                                            id="bio"
                                            name="bio"
                                            label="Write your Bio"
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                            InputLabelProps={{
                                                sx: {
                                                    fontFamily: 'Lora, serif',
                                                    '&.Mui-focused': {
                                                        color: '#06b6d4',
                                                    },
                                                },
                                            }}
                                            InputProps={{
                                                sx: {
                                                    fontFamily: 'Lora, serif',
                                                    '&:after': {
                                                        borderBottomColor: '#06b6d4',
                                                    },
                                                },
                                            }}
                                        />
                                    </Box>
                                </DialogContent>
                                <DialogActions>
                                    <p
                                        className="px-2 py-0.5 bg-red-200 rounded font-lora font-medium border border-red-400 hover:cursor-pointer active:bg-red-100 active:border-red-300 active:shadow-inner transition-all duration-200 ease-in-out active:scale-75 select-none"
                                        onClick={handleBioClose}
                                    >
                                        Cancel
                                    </p>
                                    <button
                                        type="submit"
                                        className="text-white px-2 py-0.5 bg-cyan-500 rounded font-lora font-medium border border-cyan-600 hover:cursor-pointer active:bg-cyan-400 active:border-cyan-600 active:shadow-inner transition-all duration-200 ease-in-out active:scale-75 select-none"
                                    >
                                        Save Bio
                                    </button>
                                </DialogActions>
                            </Dialog>
                        </section>
                    </Box>
                ) : (
                    <Box className="flex flex-col justify-center items-center">
                        <section><ArrowDropDownIcon sx={{ fontSize: "50px", color: "orange" }} /><ArrowDropDownIcon sx={{ fontSize: "50px", color: "orange" }} /></section>
                        <p className="bg-gray-200 font-lora font-semibold px-5 py-1 rounded-md border-2 border-gray-400 hover:bg-gray-300 hover:cursor-pointer active:bg-gray-400 active:border-gray-500 active:shadow-inner transition-all duration-200 ease-in-out active:scale-75 w-max mx-auto select-none" onClick={handleBioOpen}>Add your bio</p>

                        {/* Dialog */}
                        <Dialog
                            open={bioDialogOpen}
                            onClose={handleBioClose}
                            PaperProps={{
                                component: 'form',
                                onSubmit: (event) => {
                                    event.preventDefault();
                                    const formData = new FormData(event.currentTarget);
                                    const formJson = Object.fromEntries(formData.entries());
                                    const bio = formJson.bio;
                                    handleBioChange(bio);
                                    handleBioClose();
                                },
                            }}
                        >
                            <DialogTitle sx={{ fontFamily: 'Lora, serif' }}>Add Your Profile&apos;s Bio</DialogTitle>
                            <DialogContent>
                                <DialogContentText sx={{ fontFamily: 'Lora, serif' }}>
                                    Please enter a brief bio to display on your profile. Share your experience,
                                    passions, and role in the wedding industry or how you are involved in the event.
                                </DialogContentText>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <AccountCircleIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                    <TextField
                                        autoFocus
                                        required
                                        margin="dense"
                                        id="bio"
                                        name="bio"
                                        label="Write your Bio"
                                        type="text"
                                        fullWidth
                                        variant="standard"
                                        InputLabelProps={{
                                            sx: {
                                                fontFamily: 'Lora, serif',
                                                '&.Mui-focused': {
                                                    color: '#06b6d4',
                                                },
                                            },
                                        }}
                                        InputProps={{
                                            sx: {
                                                fontFamily: 'Lora, serif',
                                                '&:after': {
                                                    borderBottomColor: '#06b6d4',
                                                },
                                            },
                                        }}
                                    />
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <p
                                    className="px-2 py-0.5 bg-red-200 rounded font-lora font-medium border border-red-400 hover:cursor-pointer active:bg-red-100 active:border-red-300 active:shadow-inner transition-all duration-200 ease-in-out active:scale-75 select-none"
                                    onClick={handleBioClose}
                                >
                                    Cancel
                                </p>
                                <button
                                    type="submit"
                                    className="text-white px-2 py-0.5 bg-cyan-500 rounded font-lora font-medium border border-cyan-600 hover:cursor-pointer active:bg-cyan-400 active:border-cyan-600 active:shadow-inner transition-all duration-200 ease-in-out active:scale-75 select-none"
                                >
                                    Save Bio
                                </button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                )}
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
