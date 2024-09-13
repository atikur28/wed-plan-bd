"use client";

import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Alert, Box, Button, IconButton, InputAdornment, Snackbar, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignInForm() {
    const router = useRouter();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const validateForm = () => {
        const newErrors = {};

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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            setLoading(true);

            try {
                const res = await fetch("/api/users/signin", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const result = await res.json();
                setLoading(false);

                if (res.ok) {
                    setEmail("");
                    setPassword("");
                    setErrors({});
                    router.push("/");
                } else {
                    setErrors({ signInError: result.error });
                    setSnackbarMessage(result.error);
                    setSnackbarOpen(true);
                }
            } catch (error) {
                setLoading(false);
                setErrors({ signInError: "An unexpected error occurred" });
                setSnackbarMessage("An unexpected error occurred");
                setSnackbarOpen(true);
            }
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box className="flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
            <Box className="max-w-md w-full space-y-8 p-8 border-l border-t rounded-md">
                <Typography
                    component="h1"
                    variant="h5"
                    className="text-2xl dark:text-white font-lora font-bold mb-6"
                >
                    {loading ? "Processing" : "Sign In"}
                </Typography>
                <form className="space-y-4">
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

                    {errors.signInError && (
                        <Typography color="error" className="font-lora mt-2">
                            {errors.signInError}
                        </Typography>
                    )}

                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className="bg-gray-400 font-lora font-bold mt-4"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
            </Box>

            {/* Snackbar for errors */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
