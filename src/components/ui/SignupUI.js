"use client";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CategoryIcon from '@mui/icons-material/Category';
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Alert, Box, Button, IconButton, InputAdornment, MenuItem, Snackbar, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const getCategories = async () => {
    const res = await fetch("http://localhost:3022/api/categories");
    const data = await res.json();
    return data.result;
};

export default function SignUpForm() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userCategory, setUserCategory] = useState("");

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("success");

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getCategories();
            setCategories(data);
        };
        fetchCategories();
    }, []);

    const validateForm = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = "Full name is required";
        }

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Enter a valid Email address";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!userCategory) {
            newErrors.userCategory = "Please select a category";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        const registerError = {};

        if (validateForm()) {
            setLoading(true);

            let userStatus = "";

            if (userCategory === "user") {
                userStatus = "User"
            } else {
                userStatus = "Provider"
            }

            const professionFinder = await categories?.find((p) => p.pathName === userCategory);
            const profession = await professionFinder?.name || "User";

            const user = {
                name,
                image: "",
                email,
                password,
                age: "",
                address: "",
                bio: "",
                additionalInfo: [],
                status: userStatus,
                userCategory,
                professionName: profession,
                popularity: [],
                signedUp: new Date()
            };

            try {
                let res = await fetch("http://localhost:3022/api/users/signup", {
                    method: "POST",
                    body: JSON.stringify(user),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                res = await res.json();

                setLoading(false);
                if (res.success) {
                    setAlertMessage("Registered successfully!");
                    setAlertType("success");
                    setAlertOpen(true);
                    setErrors({});
                    setName("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    setUserCategory("");
                } else {
                    setAlertMessage(res.message || "Registration failed");
                    setAlertType("error");
                    setAlertOpen(true);
                }
            } catch (error) {
                registerError.signupError = error;
                setErrors(registerError);
                setAlertMessage("An error occurred during registration.");
                setAlertType("error");
                setAlertOpen(true);
                setLoading(false);
            }
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    return (
        <Box className="flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
            <Box className="max-w-md w-full px-8 pt-8 border-l border-t rounded-md">
                <h3
                    className="text-2xl dark:text-white font-lora font-bold mb-6"
                >
                    {loading ? "Processing" : "Sign Up"}
                </h3>
                <form className="space-y-4">
                    {/* Full Name */}
                    <TextField
                        label="Full name"
                        fullWidth
                        required
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={{ mt: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircleIcon className="dark:text-white" />
                                </InputAdornment>
                            ),
                            sx: {
                                fontFamily: "Lora, serif",
                                color: "black",
                                ".Mui-focused": {
                                    color: "black",
                                },
                                ".MuiInputBase-root": {
                                    color: "white",
                                },
                            },
                            className: "dark:text-white",
                        }}
                        InputLabelProps={{
                            sx: {
                                fontFamily: "Lora, serif",
                                color: "black",
                                ".Mui-focused": {
                                    color: "black",
                                },
                            },
                            className: "dark:text-white",
                        }}
                    />

                    {/* Category Selection */}
                    <TextField
                        label="Select your activity"
                        select
                        fullWidth
                        name="userCategory"
                        value={userCategory}
                        onChange={(e) => setUserCategory(e.target.value)}
                        error={!!errors.userCategory}
                        helperText={errors.userCategory}
                        sx={{ mt: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CategoryIcon className="dark:text-white" />
                                </InputAdornment>
                            ),
                            sx: {
                                fontFamily: "Lora, serif",
                                color: "black",
                                ".Mui-focused": {
                                    color: "black",
                                },
                                ".MuiInputBase-root": {
                                    color: "white",
                                },
                            },
                            className: "dark:text-white",
                        }}
                        InputLabelProps={{
                            sx: {
                                fontFamily: "Lora, serif",
                                color: "black",
                                ".Mui-focused": {
                                    color: "black",
                                },
                            },
                            className: "dark:text-white",
                        }}
                    >
                        <MenuItem value="user">
                            <Typography sx={{ fontFamily: "Lora, serif" }}>User</Typography>
                        </MenuItem>
                        {categories?.map((category, index) => (
                            <MenuItem key={index} value={category?.pathName}>
                                <Typography sx={{ fontFamily: "Lora, serif" }}>
                                    {category?.name}
                                </Typography>
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Email */}
                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        required
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        sx={{ mt: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon className="dark:text-white" />
                                </InputAdornment>
                            ),
                            sx: {
                                fontFamily: "Lora, serif",
                                color: "black",
                                ".Mui-focused": {
                                    color: "black",
                                },
                                ".MuiInputBase-root": {
                                    color: "white",
                                },
                            },
                            className: "dark:text-white",
                        }}
                        InputLabelProps={{
                            sx: {
                                fontFamily: "Lora, serif",
                                color: "black",
                                ".Mui-focused": {
                                    color: "black",
                                },
                            },
                            className: "dark:text-white",
                        }}
                    />

                    {/* Password */}
                    <TextField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        fullWidth
                        required
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                        sx={{ mt: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon className="dark:text-white" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        className="dark:text-white"
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                fontFamily: "Lora, serif",
                                color: "black",
                                ".Mui-focused": {
                                    color: "black",
                                },
                                ".MuiInputBase-root": {
                                    color: "white",
                                },
                            },
                            className: "dark:text-white",
                        }}
                        InputLabelProps={{
                            sx: {
                                fontFamily: "Lora, serif",
                                color: "black",
                                ".Mui-focused": {
                                    color: "black",
                                },
                            },
                            className: "dark:text-white",
                        }}
                    />

                    {/* Confirm Password */}
                    <TextField
                        label="Confirm Password"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        fullWidth
                        required
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        sx={{ mt: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon className="dark:text-white" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        className="dark:text-white"
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                fontFamily: "Lora, serif",
                                color: "black",
                                ".Mui-focused": {
                                    color: "black",
                                },
                                ".MuiInputBase-root": {
                                    color: "white",
                                },
                            },
                            className: "dark:text-white",
                        }}
                        InputLabelProps={{
                            sx: {
                                fontFamily: "Lora, serif",
                                color: "black",
                                ".Mui-focused": {
                                    color: "black",
                                },
                            },
                            className: "dark:text-white",
                        }}
                    />

                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Sign Up"}
                    </Button>
                </form>

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
                <p className="text-base font-lora font-medium pb-3 mt-3">Already have an account? <Link href="/signin" className="text-blue-700">Sign In</Link></p>
            </Box>
        </Box>
    );
}
