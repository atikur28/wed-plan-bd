"use client";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignUpForm() {
    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Enter a valid Email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        const registerError = {};

        if (validateForm()) {
            setLoading(true);
            const user = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                status: "User",
            }
            console.log(user);

            try {
                let res = await fetch("http://localhost:3000/api/users/signup", {
                    method: "Post",
                    body: JSON.stringify(user)
                });
                res = await res.json();
                setLoading(false);
                setErrors({});
                setFirstName("");
                setLastName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                router.push("/signin")
                alert("registered successfully!");
            } catch (error) {
                registerError.signupError = error;
                setErrors(registerError);
            }
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Box className="flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
            <Box className="max-w-md w-full space-y-8 p-8 border-l border-t rounded-md">
                <Typography
                    component="h1"
                    variant="h5"
                    className="text-2xl dark:text-white font-lora font-bold mb-6"
                >
                    {loading ? "Processing" : "Sign Up"}
                </Typography>
                <form className="space-y-4">
                    {/* First Name */}
                    <TextField
                        label="First Name"
                        fullWidth
                        required
                        name="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        sx={{ mt: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircleIcon className="dark:text-white" />
                                </InputAdornment>
                            ),
                            sx: {
                                fontFamily: 'Lora, serif',
                                color: 'black',
                                '.Mui-focused': {
                                    color: 'black',
                                },
                                '.MuiInputBase-root': {
                                    color: 'white', // Change text color
                                },
                            },
                            className: 'dark:text-white',
                        }}
                        InputLabelProps={{
                            sx: {
                                fontFamily: 'Lora, serif',
                                color: 'black',
                                '.Mui-focused': {
                                    color: 'black',
                                },
                            },
                            className: 'dark:text-white',
                        }}
                    />

                    {/* Last Name */}
                    <TextField
                        label="Last Name"
                        variant="outlined"
                        fullWidth
                        name="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                        sx={{ mt: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircleIcon className="dark:text-white" />
                                </InputAdornment>
                            ),
                            sx: {
                                fontFamily: 'Lora, serif',
                                color: 'black',
                                '.Mui-focused': {
                                    color: 'black',
                                },
                                '.MuiInputBase-root': {
                                    color: 'white',
                                },
                            },
                            className: 'dark:text-white',
                        }}
                        InputLabelProps={{
                            sx: {
                                fontFamily: 'Lora, serif',
                                color: 'black',
                                '.Mui-focused': {
                                    color: 'black',
                                },
                            },
                            className: 'dark:text-white',
                        }}
                    />

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
                                fontFamily: 'Lora, serif',
                                color: 'black',
                                '.Mui-focused': {
                                    color: 'black',
                                },
                                '.MuiInputBase-root': {
                                    color: 'white',
                                },
                            },
                            className: 'dark:text-white',
                        }}
                        InputLabelProps={{
                            sx: {
                                fontFamily: 'Lora, serif',
                                color: 'black',
                                '.Mui-focused': {
                                    color: 'black',
                                },
                            },
                            className: 'dark:text-white',
                        }}
                    />

                    {/* Password */}
                    <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
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
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff className="dark:text-white" /> : <Visibility className="dark:text-white" />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                fontFamily: 'Lora, serif',
                                color: 'black',
                                '.Mui-focused': {
                                    color: 'black',
                                },
                                '.MuiInputBase-root': {
                                    color: 'white',
                                },
                            },
                            className: 'dark:text-white',
                        }}
                        InputLabelProps={{
                            sx: {
                                fontFamily: 'Lora, serif',
                                color: 'black',
                                '.Mui-focused': {
                                    color: 'black',
                                },
                            },
                            className: 'dark:text-white',
                        }}
                    />

                    {/* Confirm Password */}
                    <TextField
                        label="Confirm Password"
                        type="password"
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
                            sx: {
                                fontFamily: 'Lora, serif',
                                color: 'black',
                                '.Mui-focused': {
                                    color: 'black',
                                },
                                '.MuiInputBase-root': {
                                    color: 'white',
                                },
                            },
                            className: 'dark:text-white',
                        }}
                        InputLabelProps={{
                            sx: {
                                fontFamily: 'Lora, serif',
                                color: 'black',
                                '.Mui-focused': {
                                    color: 'black',
                                },
                            },
                            className: 'dark:text-white',
                        }}
                    />

                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className="bg-gray-400 font-lora font-bold mt-4"
                        onClick={handleSubmit}
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </Button>
                </form>
            </Box>
        </Box>
    );
}
