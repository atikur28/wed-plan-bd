"use client";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useState } from 'react';

export default function SignUpForm() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        gmail: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.gmail.trim()) {
            newErrors.gmail = 'Gmail is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.gmail)) {
            newErrors.gmail = 'Enter a valid Gmail address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form Data:', formData);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Box
            className="flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8"
        >
            <Box className="max-w-md w-full space-y-8 p-8 border-l border-t rounded-md">
                <Typography
                    component="h1"
                    variant="h5"
                    className="text-2xl font-lora font-bold mb-6"
                >
                    Sign Up
                </Typography>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* First Name */}
                    <TextField
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        required
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        sx={{ mt: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircleIcon />
                                </InputAdornment>
                            ),
                            sx: {
                                fontFamily: 'Lora, serif',
                            },
                        }}
                        InputLabelProps={{
                            sx: {
                                fontFamily: 'Lora, serif',
                            },
                        }}
                    />

                    {/* Last Name */}
                    <TextField
                        label="Last Name"
                        variant="outlined"
                        fullWidth
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                        sx={{ mt: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircleIcon />
                                </InputAdornment>
                            ),
                            sx: {
                                fontFamily: 'Lora, serif',
                            },
                        }}
                        InputLabelProps={{
                            sx: {
                                fontFamily: 'Lora, serif',
                            },
                        }}
                    />

                    {/* Gmail */}
                    <TextField
                        label="Gmail"
                        type="email"
                        variant="outlined"
                        fullWidth
                        required
                        name="gmail"
                        value={formData.gmail}
                        onChange={handleChange}
                        error={!!errors.gmail}
                        helperText={errors.gmail}
                        sx={{ mt: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon />
                                </InputAdornment>
                            ),
                            sx: {
                                fontFamily: 'Lora, serif',
                            },
                        }}
                        InputLabelProps={{
                            sx: {
                                fontFamily: 'Lora, serif',
                            },
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
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        sx={{ mt: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                fontFamily: 'Lora, serif',
                            },
                        }}
                        InputLabelProps={{
                            sx: {
                                fontFamily: 'Lora, serif',
                            },
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
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        sx={{ mt: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon />
                                </InputAdornment>
                            ),
                            sx: {
                                fontFamily: 'Lora, serif',
                            },
                        }}
                        InputLabelProps={{
                            sx: {
                                fontFamily: 'Lora, serif',
                            },
                        }}
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        fullWidth
                        color="#000000"
                        sx={{ mt: 4, bgcolor: "#e1e1e1", fontFamily: "lora", fontSize: '16px', fontWeight: 700 }}
                    >
                        Sign Up
                    </Button>
                </form>
            </Box>
        </Box>
    );
}
