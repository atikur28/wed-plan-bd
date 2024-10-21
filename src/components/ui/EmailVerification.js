"use client";

import { Alert, Box, Button, Snackbar, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EmailVerification = () => {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const router = useRouter();

    const verifyUser = async () => {
        try {
            const response = await axios.post("/api/users/verifyemail", { token });
            setVerified(true);
            setSnackbarOpen(true);
            setError("");
        } catch (err) {
            setError(err.response?.data || "Verification failed!");
            setSnackbarOpen(true);
        }
    };

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, []);

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleSignInClick = () => {
        router.push("/signin");
    };

    return (
        <Box className="pt-10 flex flex-col justify-center items-center">
            <h3 className="text-2xl font-bold mb-4">
                Email Verification
            </h3>

            {verified ? (
                <Alert severity="success" className="w-full mb-4">
                    Your email has been verified successfully! You can now sign in.
                </Alert>
            ) : (
                <>
                    {token ? (
                        <p className="text-lg font-semibold text-center mt-2">
                            Please click the button below to verify your email.
                        </p>
                    ) : (
                        <p className="text-lg font-semibold text-center mt-2 text-red-600">
                            Verification token is missing. Please check your email for the verification link.
                        </p>
                    )}

                    <Button
                        onClick={verifyUser}
                        className="px-5 mt-5 text-white font-semibold bg-green-600 w-max"
                        disabled={!token || verified}
                    >
                        {verified ? "Verified" : "Verify"}
                    </Button>
                </>
            )}

            {error && !verified && (
                <Alert severity="error" className="w-full mt-4">
                    {error}
                </Alert>
            )}

            <Button
                onClick={handleSignInClick}
                className="px-5 mt-5 text-white font-semibold bg-blue-600 w-max"
            >
                Go to Sign In
            </Button>

            {/* Snackbar for success or error notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                {verified ? (
                    <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                        <Typography sx={{ textAlign: 'center', width: '100%' }}>
                            Email verified successfully! You can now sign in.
                        </Typography>
                    </Alert>
                ) : (
                    <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                        <Typography sx={{ textAlign: 'center', width: '100%' }}>
                            {error}
                        </Typography>
                    </Alert>
                )}
            </Snackbar>
        </Box>
    );
};

export default EmailVerification;
