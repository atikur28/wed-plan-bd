"use client";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from "@mui/icons-material/Person";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { Alert, Avatar, Box, Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Snackbar, TextField } from "@mui/material";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const ProfileInfo = ({ uploadData }) => {
    // States Code:
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [othersInfoList, setOthersInfoList] = useState([{ property: '', info: '' }]);
    const fileInputRef = useRef(null);
    const [selectedPostImage, setSelectedPostImage] = useState(null);
    const [postImageFile, setPostImageFile] = useState(null);
    const [postFormData, setPostFormData] = useState({
        serviceName: '',
        serviceDescription: '',
        contactNumber: '',
        priceRange: '',
        location: '',
        availabilityDays: '',
        emailAddress: '',
    });

    // Alert Code:
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("success");

    // Dialogs States Code:
    const [nameDialogOpen, setNameDialogOpen] = useState(false);
    const [professionDialogOpen, setProfessionDialogOpen] = useState(false);
    const [bioDialogOpen, setBioDialogOpen] = useState(false);
    const [ageDialogOpen, setAgeDialogOpen] = useState(false);
    const [addressDialogOpen, setAddressDialogOpen] = useState(false);
    const [othersInfoDialogOpen, setOthersInfoDialogOpen] = useState(false);

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
                const profileResponse = await fetch("http://localhost:3026/api/users/profile", {
                    method: "POST",
                    credentials: "include",
                });
                const profileData = await profileResponse.json();

                const email = profileData.result.email;

                if (profileData.success) {
                    // User info setup
                    const usersResponse = await fetch("http://localhost:3026/api/users", {
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
                    name: profile.name,
                    image: data.url,
                    email: profile.email,
                    userCategory: profile.userCategory,
                    status: profile.status,
                };

                const updateResponse = await fetch("http://localhost:3026/api/users/profile/update-profile", {
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
                setAlertMessage("Name should be under 30 letter!");
                setAlertType("error");
                setAlertOpen(true);
            } else {
                const updatedProfileData = {
                    name: name,
                    image: profile.image,
                    email: profile.email,
                    age: profile.age,
                    address: profile.address,
                    bio: profile.bio,
                    additionalInfo: profile.additionalInfo,
                    userCategory: profile.userCategory,
                    status: profile.status,
                };

                const userResponse = await fetch("http://localhost:3026/api/users/profile/update-profile", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedProfileData),
                });

                const userResult = await userResponse.json();

                if (userResult.success) {
                    setProfile((prevProfile) => ({
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
                setAlertMessage("Bio message should be under 205 letter!");
                setAlertType("error");
                setAlertOpen(true);
            } else {
                const updatedBioData = {
                    name: profile.name,
                    image: profile.image,
                    email: profile.email,
                    age: profile.age,
                    address: profile.address,
                    bio: bio,
                    additionalInfo: profile.additionalInfo,
                    userCategory: profile.userCategory,
                    status: profile.status,
                };

                const response = await fetch("http://localhost:3026/api/users/profile/update-profile", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedBioData),
                });

                const updatedResult = await response.json();
                if (updatedResult.success) {
                    setProfile((prevProfile) => ({
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
    };

    // Age Add & Changing Code:
    const handleAgeOpen = () => {
        setAgeDialogOpen(true);
    };

    const handleAgeClose = () => {
        setAgeDialogOpen(false);
    };

    const handleAgeChange = async (age) => {
        try {
            setLoading(true);
            if (age.length > 3) {
                setAlertMessage("Age should be under 3 number!");
                setAlertType("error");
                setAlertOpen(true);
            } else {
                const updatedAgeData = {
                    name: profile.name,
                    image: profile.image,
                    email: profile.email,
                    age: age,
                    address: profile.address,
                    bio: profile.bio,
                    additionalInfo: profile.additionalInfo,
                    userCategory: profile.userCategory,
                    status: profile.status,
                };

                const response = await fetch("http://localhost:3026/api/users/profile/update-profile", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedAgeData),
                });

                const updatedResult = await response.json();
                if (updatedResult.success) {
                    setProfile((prevProfile) => ({
                        ...prevProfile,
                        age: age,
                    }));
                    setAlertMessage("Age saved successfully!");
                    setAlertType("success");
                    setAlertOpen(true);
                } else {
                    console.log("Failed to save age");
                    setAlertMessage("Failed to save age.");
                    setAlertType("error");
                    setAlertOpen(true);
                }
            }
        } catch (error) {
            console.log("Error saving profile's age", error);
            setAlertMessage("Error saving profile's age.");
            setAlertType("error");
            setAlertOpen(true);
        } finally {
            setLoading(false);
        }
    };

    // Address Add & Changing Code:
    const handleAddressOpen = () => {
        setAddressDialogOpen(true);
    };

    const handleAddressClose = () => {
        setAddressDialogOpen(false);
    };

    const handleAddressChange = async (address) => {
        try {
            setLoading(true);
            if (address.length > 50) {
                setAlertMessage("Address should be under 50 letter!");
                setAlertType("error");
                setAlertOpen(true);
            } else {
                const updatedAddressData = {
                    name: profile.name,
                    image: profile.image,
                    email: profile.email,
                    age: profile.age,
                    address: address,
                    bio: profile.bio,
                    additionalInfo: profile.additionalInfo,
                    userCategory: profile.userCategory,
                    status: profile.status,
                };

                const response = await fetch("http://localhost:3026/api/users/profile/update-profile", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedAddressData),
                });

                const updatedResult = await response.json();
                if (updatedResult.success) {
                    setProfile((prevProfile) => ({
                        ...prevProfile,
                        address: address,
                    }));
                    setAlertMessage("Address saved successfully!");
                    setAlertType("success");
                    setAlertOpen(true);
                } else {
                    console.log("Failed to save address");
                    setAlertMessage("Failed to save address.");
                    setAlertType("error");
                    setAlertOpen(true);
                }
            }
        } catch (error) {
            console.log("Error saving profile's address", error);
            setAlertMessage("Error saving profile's address.");
            setAlertType("error");
            setAlertOpen(true);
        } finally {
            setLoading(false);
        }
    }

    // Others Info Adding Code:
    const handleOtherInfoOpen = () => {
        setOthersInfoList(profile?.additionalInfo || [{ property: '', info: '' }]);
        setOthersInfoDialogOpen(true);
    };

    const handleOtherInfoClose = () => {
        setOthersInfoDialogOpen(false);
    };

    const handleOthersInfoInputChange = (index, event) => {
        const { name, value } = event.target;
        const list = [...othersInfoList];
        list[index][name] = value;
        setOthersInfoList(list);
    };

    const handleAddMoreOthersInfo = () => {
        setOthersInfoList([...othersInfoList, { property: '', info: '' }]);
    };

    const handleDeleteOthersInfo = (index) => {
        const list = [...othersInfoList];
        list.splice(index, 1);
        setOthersInfoList(list);
    };

    const handleSaveOthersInfo = async () => {
        try {
            setLoading(true);
            const updatedAdditionalInfo = [...othersInfoList];

            const updatedAdditionalInfoData = {
                name: profile.name,
                image: profile.image,
                email: profile.email,
                age: profile.age,
                address: profile.address,
                bio: profile.bio,
                additionalInfo: updatedAdditionalInfo,
                userCategory: profile.userCategory,
                status: profile.status,
            };

            const additionalInfoResponse = await fetch("http://localhost:3026/api/users/profile/update-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedAdditionalInfoData),
            });

            const updatedAdditionalInfoResult = await additionalInfoResponse.json();

            if (updatedAdditionalInfoResult.success) {
                setProfile((prevProfile) => ({
                    ...prevProfile,
                    additionalInfo: updatedAdditionalInfo,
                }));
                setAlertMessage("Additional info updated successfully!");
                setAlertType("success");
                setAlertOpen(true);
            } else {
                console.error("Failed to update additional info.");
                setAlertMessage("Error saving provider's additional info.");
                setAlertType("error");
                setAlertOpen(true);
            }

            handleOtherInfoClose();
        } catch (error) {
            console.error("Error saving additional info:", error);
        } finally {
            setLoading(false);
        }
    };

    // Post Posting Code:
    const handlePostImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedPostImage(URL.createObjectURL(file));
            setPostImageFile(file);
        }
    };

    const handleInputChange = (e) => {
        setPostFormData({ ...postFormData, [e.target.name]: e.target.value });
    };

    const handlePostUpload = () => {
        if (!postImageFile) {
            setAlertMessage('Please select an image before posting.');
            setAlertType("error");
            setAlertOpen(true);
            return;
        }

        console.log('Image File:', postImageFile);
        console.log('Form Data:', postFormData);
    };

    if (loading) {
        return (
            <Box className="mt-8 flex justify-center items-center h-[50vh]">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box className="flex flex-col md:flex-row justify-center gap-5 md:gap-[2%] px-2 md:px-8 pb-2">
            {/* First Section: Profile Info */}
            <section className="md:w-[40%] lg:w-[35%] 3xl:w-[700px] flex flex-col justify-center items-center gap-4 bg-slate-50 md:pt-6 md:pb-8 px-1 rounded-lg">
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
                            src={profile?.image}
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
                    <h4 className="text-2xl font-lora font-semibold">{profile?.name}</h4>
                    <section>
                        <p className="text-sm font-lora font-semibold text-blue-600 flex justify-start items-center gap-0.5 hover:cursor-pointer transition-all duration-200 ease-in-out active:scale-75 select-none ml-5" onClick={handleNameOpen}>Edit..</p>

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
                                    const name = formJson?.name;
                                    handleNameChange(name);
                                    handleNameClose();
                                },
                            }}
                        >
                            <DialogTitle sx={{ fontFamily: 'Lora, serif' }}>Edit Your Profile&apos;s Name</DialogTitle>
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
                                        defaultValue={profile?.name}
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

                {/* Email address */}
                <p className="font-lora font-medium text-center">{profile?.email}</p>

                {/* Provider's profession name showing and updating in providers database */}
                <h4 className="font-lora font-semibold text-center">{profile?.professionName}</h4>

                {/* Provider's bio showing and updating in providers database */}
                {profile?.bio ? (
                    <Box className="flex flex-col justify-center items-center">
                        <section><ArrowDropDownIcon sx={{ fontSize: "50px", color: "orange" }} /><ArrowDropDownIcon sx={{ fontSize: "50px", color: "orange" }} /></section>
                        <section>
                            <p className="font-lora font-semibold text-center px-2">{profile?.bio} <span className="ml-2 text-sm text-blue-600 hover:cursor-pointer" onClick={handleBioOpen}>Edit..</span></p>

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
                                        const bio = formJson?.bio;
                                        handleBioChange(bio);
                                        handleBioClose();
                                    },
                                }}
                            >
                                <DialogTitle sx={{ fontFamily: 'Lora, serif' }}>Edit Your Profile&apos;s Bio</DialogTitle>
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
                                            defaultValue={profile?.bio}
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
                                    const bio = formJson?.bio;
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

                {/* Others data */}
                <Box className="w-[92%] md:w-[85%] mx-auto bg-gray-200 py-8 px-2 md:px-5 rounded-md">
                    {/* Age add & changing in providers database */}
                    {profile?.age ? (
                        <Box className="flex justify-between items-center mb-3">
                            <p className='font-lora text-lg'><span className='font-bold'>Age:</span> {profile?.age}.</p>
                            <p className='text-sm font-lora font-semibold text-blue-600 hover:cursor-pointer transition-all duration-200 ease-in-out active:scale-75 select-none' onClick={handleAgeOpen}>Edit..</p>

                            {/* Dialog */}
                            <Dialog
                                open={ageDialogOpen}
                                onClose={handleAgeClose}
                                PaperProps={{
                                    component: 'form',
                                    onSubmit: (event) => {
                                        event.preventDefault();
                                        const formData = new FormData(event.currentTarget);
                                        const formJson = Object.fromEntries(formData.entries());
                                        const age = formJson?.age;
                                        handleAgeChange(age);
                                        handleAgeClose();
                                    },
                                }}
                            >
                                <DialogTitle sx={{ fontFamily: 'Lora, serif' }}>Edit Age</DialogTitle>
                                <DialogContent>
                                    <DialogContentText sx={{ fontFamily: 'Lora, serif' }}>
                                        Please enter your age to display on your profile. This helps personalize your experience and connect with others in the wedding industry or event.
                                    </DialogContentText>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <AccountCircleIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                        <TextField
                                            autoFocus
                                            required
                                            margin="dense"
                                            id="age"
                                            name="age"
                                            label="Write your age"
                                            type="number"
                                            fullWidth
                                            variant="standard"
                                            defaultValue={profile?.age}
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
                                        onClick={handleAgeClose}
                                    >
                                        Cancel
                                    </p>
                                    <button
                                        type="submit"
                                        className="text-white px-2 py-0.5 bg-cyan-500 rounded font-lora font-medium border border-cyan-600 hover:cursor-pointer active:bg-cyan-400 active:border-cyan-600 active:shadow-inner transition-all duration-200 ease-in-out active:scale-75 select-none"
                                    >
                                        Save Age
                                    </button>
                                </DialogActions>
                            </Dialog>
                        </Box>
                    ) : (
                        <section className='mb-3'>
                            <p className="text-lg font-lora font-bold flex justify-between items-center">Age: <span className='text-sm text-blue-600 hover:cursor-pointer transition-all duration-200 ease-in-out active:scale-75 select-none' onClick={handleAgeOpen}>Add..</span></p>

                            {/* Dialog */}
                            <Dialog
                                open={ageDialogOpen}
                                onClose={handleAgeClose}
                                PaperProps={{
                                    component: 'form',
                                    onSubmit: (event) => {
                                        event.preventDefault();
                                        const formData = new FormData(event.currentTarget);
                                        const formJson = Object.fromEntries(formData.entries());
                                        const age = formJson?.age;
                                        handleAgeChange(age);
                                        handleAgeClose();
                                    },
                                }}
                            >
                                <DialogTitle sx={{ fontFamily: 'Lora, serif' }}>Add Age</DialogTitle>
                                <DialogContent>
                                    <DialogContentText sx={{ fontFamily: 'Lora, serif' }}>
                                        Please enter your age to display on your profile. This helps personalize your experience and connect with others in the wedding industry or event.
                                    </DialogContentText>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <AccountCircleIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                        <TextField
                                            autoFocus
                                            required
                                            margin="dense"
                                            id="age"
                                            name="age"
                                            label="Write your age"
                                            type="number"
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
                                        onClick={handleAgeClose}
                                    >
                                        Cancel
                                    </p>
                                    <button
                                        type="submit"
                                        className="text-white px-2 py-0.5 bg-cyan-500 rounded font-lora font-medium border border-cyan-600 hover:cursor-pointer active:bg-cyan-400 active:border-cyan-600 active:shadow-inner transition-all duration-200 ease-in-out active:scale-75 select-none"
                                    >
                                        Save Age
                                    </button>
                                </DialogActions>
                            </Dialog>
                        </section>
                    )}

                    {/* Address add & changing in providers database */}
                    {profile?.address ? (
                        <Box className="flex justify-between items-center mb-3">
                            <p className='font-lora text-lg'><span className='font-bold'>Address:</span> {profile?.address}.</p>
                            <p className='text-sm font-lora font-semibold text-blue-600 hover:cursor-pointer transition-all duration-200 ease-in-out active:scale-75 select-none' onClick={handleAddressOpen}>Edit..</p>

                            {/* Dialog */}
                            <Dialog
                                open={addressDialogOpen}
                                onClose={handleAddressClose}
                                PaperProps={{
                                    component: 'form',
                                    onSubmit: (event) => {
                                        event.preventDefault();
                                        const formData = new FormData(event.currentTarget);
                                        const formJson = Object.fromEntries(formData.entries());
                                        const address = formJson?.address;
                                        handleAddressChange(address);
                                        handleAddressClose();
                                    },
                                }}
                            >
                                <DialogTitle sx={{ fontFamily: 'Lora, serif' }}>Edit Address</DialogTitle>
                                <DialogContent>
                                    <DialogContentText sx={{ fontFamily: 'Lora, serif' }}>
                                        Please enter your address to display on your profile. This helps personalize your experience and connect with local vendors or events in the wedding industry.
                                    </DialogContentText>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <AccountCircleIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                        <TextField
                                            autoFocus
                                            required
                                            margin="dense"
                                            id="address"
                                            name="address"
                                            label="Write your address"
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                            defaultValue={profile?.address}
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
                                        onClick={handleAddressClose}
                                    >
                                        Cancel
                                    </p>
                                    <button
                                        type="submit"
                                        className="text-white px-2 py-0.5 bg-cyan-500 rounded font-lora font-medium border border-cyan-600 hover:cursor-pointer active:bg-cyan-400 active:border-cyan-600 active:shadow-inner transition-all duration-200 ease-in-out active:scale-75 select-none"
                                    >
                                        Save Address
                                    </button>
                                </DialogActions>
                            </Dialog>
                        </Box>
                    ) : (
                        <section className='mb-3'>
                            <p className="text-lg font-lora font-bold flex justify-between items-center">Address: <span className='text-sm text-blue-600 hover:cursor-pointer transition-all duration-200 ease-in-out active:scale-75 select-none' onClick={handleAddressOpen}>Add..</span></p>

                            {/* Dialog */}
                            <Dialog
                                open={addressDialogOpen}
                                onClose={handleAddressClose}
                                PaperProps={{
                                    component: 'form',
                                    onSubmit: (event) => {
                                        event.preventDefault();
                                        const formData = new FormData(event.currentTarget);
                                        const formJson = Object.fromEntries(formData.entries());
                                        const address = formJson?.address;
                                        handleAddressChange(address);
                                        handleAddressClose();
                                    },
                                }}
                            >
                                <DialogTitle sx={{ fontFamily: 'Lora, serif' }}>Add Address</DialogTitle>
                                <DialogContent>
                                    <DialogContentText sx={{ fontFamily: 'Lora, serif' }}>
                                        Please enter your address to display on your profile. This helps personalize your experience and connect with local vendors or events in the wedding industry.
                                    </DialogContentText>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <AccountCircleIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                        <TextField
                                            autoFocus
                                            required
                                            margin="dense"
                                            id="address"
                                            name="address"
                                            label="Write your address"
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
                                        onClick={handleAddressClose}
                                    >
                                        Cancel
                                    </p>
                                    <button
                                        type="submit"
                                        className="text-white px-2 py-0.5 bg-cyan-500 rounded font-lora font-medium border border-cyan-600 hover:cursor-pointer active:bg-cyan-400 active:border-cyan-600 active:shadow-inner transition-all duration-200 ease-in-out active:scale-75 select-none"
                                    >
                                        Save Address
                                    </button>
                                </DialogActions>
                            </Dialog>
                        </section>
                    )}

                    {/* Popularity */}
                    <p className='font-lora text-lg mb-3'><span className='font-bold'>Like:</span> {profile?.popularity?.length} liked.</p>

                    {/* Additional info */}
                    <section>
                        {profile?.additionalInfo?.length < 1 ? (
                            <Box className="flex justify-between items-center">
                                <p className="font-lora font-bold text-lg">Others info:</p>
                                <p
                                    className="font-lora font-semibold text-sm text-blue-600 hover:cursor-pointer transition-all duration-200 ease-in-out active:scale-75 select-none"
                                    onClick={handleOtherInfoOpen}
                                >
                                    Add..
                                </p>
                            </Box>
                        ) : (
                            <Box>
                                <section className='flex justify-between items-center'>
                                    <p className="font-lora font-bold text-lg">Others info:</p>
                                    <p
                                        className="font-lora font-semibold text-sm text-blue-600 hover:cursor-pointer transition-all duration-200 ease-in-out active:scale-75 select-none"
                                        onClick={handleOtherInfoOpen}
                                    >
                                        Edit..
                                    </p>
                                </section>
                                <Box>
                                    <ul className='px-2 py-2 mt-2 bg-gray-300 rounded-md'>
                                        {profile?.additionalInfo?.map((info, index) => (
                                            <li key={index} className="">
                                                <strong className="font-semibold">{info.property}:</strong> {info.info}
                                            </li>
                                        ))}
                                    </ul>
                                </Box>
                            </Box>
                        )}

                        {/* Dialog for adding/editing info */}
                        <Dialog open={othersInfoDialogOpen} onClose={handleOtherInfoClose} fullWidth maxWidth="sm">
                            <DialogTitle>
                                <div className="flex justify-between items-center">
                                    <span className='font-lora'>Others Info</span>
                                    <IconButton onClick={handleOtherInfoClose}>
                                        <CloseIcon />
                                    </IconButton>
                                </div>
                            </DialogTitle>

                            <DialogContent>
                                <p className="font-lora mb-4">Please provide additional info below:</p>
                                {othersInfoList.map((item, index) => (
                                    <div key={index} className="mb-3 flex space-x-4">
                                        <TextField
                                            required
                                            margin="dense"
                                            fullWidth
                                            label="Name of info"
                                            name="property"
                                            value={item.property}
                                            variant='standard'
                                            onChange={(event) => handleOthersInfoInputChange(index, event)}
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
                                                        borderColor: '#06b6d4',
                                                    },
                                                },
                                            }}
                                        />
                                        <TextField
                                            required
                                            margin="dense"
                                            fullWidth
                                            label="Info of name"
                                            name="info"
                                            value={item.info}
                                            variant='standard'
                                            onChange={(event) => handleOthersInfoInputChange(index, event)}
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
                                                        borderColor: '#06b6d4',
                                                    },
                                                },
                                            }}
                                        />
                                        {othersInfoList.length > 1 && (
                                            <button className='px-3 bg-red-600 text-white rounded-md' onClick={() => handleDeleteOthersInfo(index)} title='Delete'>
                                                <DeleteIcon />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </DialogContent>

                            <DialogActions>
                                <button className='text-white px-2 py-0.5 bg-green-600 rounded font-lora font-medium border border-green-700 hover:cursor-pointer active:bg-green-500 active:border-green-700 active:shadow-inner transition-all duration-200 ease-in-out active:scale-75 select-none' onClick={handleAddMoreOthersInfo}>
                                    Add More
                                </button>
                                <button className='text-white px-2 py-0.5 bg-cyan-500 rounded font-lora font-medium border border-cyan-600 hover:cursor-pointer active:bg-cyan-400 active:border-cyan-600 active:shadow-inner transition-all duration-200 ease-in-out active:scale-75 select-none' onClick={handleSaveOthersInfo}>
                                    Save
                                </button>
                            </DialogActions>
                        </Dialog>
                    </section>
                </Box>
            </section>

            {/* Second Section */}
            <section className="md:w-[58%] lg:w-[73%] 3xl:w-[1400px]">
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        paddingLeft: { xs: 1, sm: 3, md: 5 },
                    }}
                >
                    <Card
                        sx={{
                            width: { xs: '100%', md: '100%', lg: '50%' },
                            p: 3,
                            borderRadius: '16px',
                            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                            backgroundColor: '#fff',
                            transition: 'box-shadow 0.3s ease-in-out',
                            '&:hover': {
                                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
                            },
                        }}
                    >
                        {/* Image Upload Section */}
                        <Box
                            sx={{
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                height: { xs: 200, sm: 250, md: 300 },
                                backgroundColor: '#f0f0f0',
                            }}
                        >
                            <input
                                accept="image/*"
                                type="file"
                                onChange={handlePostImageChange}
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    opacity: 0,
                                    cursor: 'pointer',
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                            {selectedPostImage ? (
                                <Image
                                    src={selectedPostImage}
                                    alt="Selected"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            ) : (
                                <p className="text-center font-lora font-medium">
                                    Click to select an image
                                </p>
                            )}
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    bottom: 16,
                                    right: 16,
                                    backgroundColor: '#fff',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <PhotoCamera />
                            </IconButton>
                        </Box>

                        {/* Static Property-Value Fields */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                            }}
                        >
                            {/* Service Name & Email Address */}
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Service Name"
                                    name="serviceName"
                                    variant="outlined"
                                    value={postFormData.serviceName}
                                    onChange={handleInputChange}
                                    InputLabelProps={{
                                        style: { fontFamily: 'Lora' },
                                    }}
                                    InputProps={{
                                        style: { fontFamily: 'Lora' },
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': { borderColor: '#06b6d4' },
                                            '&.Mui-focused fieldset': { borderColor: '#06b6d4' },
                                        },
                                        '& label.Mui-focused': { color: '#06b6d4' },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    name="emailAddress"
                                    variant="outlined"
                                    value={postFormData.emailAddress}
                                    onChange={handleInputChange}
                                    InputLabelProps={{
                                        style: { fontFamily: 'Lora' },
                                    }}
                                    InputProps={{
                                        style: { fontFamily: 'Lora' },
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': { borderColor: '#06b6d4' },
                                            '&.Mui-focused fieldset': { borderColor: '#06b6d4' },
                                        },
                                        '& label.Mui-focused': { color: '#06b6d4' },
                                    }}
                                />
                            </Box>

                            {/* Contact Number & Price Range */}
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Contact Number"
                                    name="contactNumber"
                                    variant="outlined"
                                    value={postFormData.contactNumber}
                                    onChange={handleInputChange}
                                    InputLabelProps={{
                                        style: { fontFamily: 'Lora' },
                                    }}
                                    InputProps={{
                                        style: { fontFamily: 'Lora' },
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': { borderColor: '#06b6d4' },
                                            '&.Mui-focused fieldset': { borderColor: '#06b6d4' },
                                        },
                                        '& label.Mui-focused': { color: '#06b6d4' },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Price Range"
                                    name="priceRange"
                                    variant="outlined"
                                    value={postFormData.priceRange}
                                    onChange={handleInputChange}
                                    InputLabelProps={{
                                        style: { fontFamily: 'Lora' },
                                    }}
                                    InputProps={{
                                        style: { fontFamily: 'Lora' },
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': { borderColor: '#06b6d4' },
                                            '&.Mui-focused fieldset': { borderColor: '#06b6d4' },
                                        },
                                        '& label.Mui-focused': { color: '#06b6d4' },
                                    }}
                                />
                            </Box>

                            {/* Location & Availability Days */}
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Location"
                                    name="location"
                                    variant="outlined"
                                    value={postFormData.location}
                                    onChange={handleInputChange}
                                    InputLabelProps={{
                                        style: { fontFamily: 'Lora' },
                                    }}
                                    InputProps={{
                                        style: { fontFamily: 'Lora' },
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': { borderColor: '#06b6d4' },
                                            '&.Mui-focused fieldset': { borderColor: '#06b6d4' },
                                        },
                                        '& label.Mui-focused': { color: '#06b6d4' },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Availability Days"
                                    name="availabilityDays"
                                    variant="outlined"
                                    value={postFormData.availabilityDays}
                                    onChange={handleInputChange}
                                    InputLabelProps={{
                                        style: { fontFamily: 'Lora' },
                                    }}
                                    InputProps={{
                                        style: { fontFamily: 'Lora' },
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': { borderColor: '#06b6d4' },
                                            '&.Mui-focused fieldset': { borderColor: '#06b6d4' },
                                        },
                                        '& label.Mui-focused': { color: '#06b6d4' },
                                    }}
                                />
                            </Box>

                            {/* Service Description */}
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Service Description"
                                    name="serviceDescription"
                                    variant="outlined"
                                    value={postFormData.serviceDescription}
                                    onChange={handleInputChange}
                                    InputLabelProps={{
                                        style: { fontFamily: 'Lora' },
                                    }}
                                    InputProps={{
                                        style: { fontFamily: 'Lora' },
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': { borderColor: '#06b6d4' },
                                            '&.Mui-focused fieldset': { borderColor: '#06b6d4' },
                                        },
                                        '& label.Mui-focused': { color: '#06b6d4' },
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Post Button */}
                        <button
                            onClick={handlePostUpload}
                            className="px-4 py-2 mt-4 text-white bg-cyan-500 hover:bg-cyan-600 rounded-lg shadow-sm transition-all duration-200 ease-in-out active:scale-90 select-none"
                        >
                            Post
                        </button>
                    </Card>
                </Box>
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
