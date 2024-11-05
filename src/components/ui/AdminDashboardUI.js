"use client";

import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Avatar, Box, Button, CircularProgress, Divider, Grid, List, ListItem, ListItemText, Paper, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

const AdminDashboardUI = () => {
    const [user, setUser] = React.useState([]);
    const [allUsers, setAllUser] = React.useState([]);
    const [allProviders, setAllProviders] = React.useState([]);
    const [newRegistration, setNewRegistration] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const isToday = (dateString) => {
            const today = new Date();
            const inputDate = new Date(dateString);

            return (
                today.getFullYear() === inputDate.getFullYear() &&
                today.getMonth() === inputDate.getMonth() &&
                today.getDate() === inputDate.getDate()
            );
        };

        const fetchUser = async () => {
            try {
                setLoading(true);

                const profileResponse = await fetch("http://localhost:3026/api/users/profile", {
                    method: "POST",
                    credentials: "include",
                });
                const profileData = await profileResponse.json();

                if (profileData.success) {
                    const email = profileData.result.email;

                    const userResponse = await fetch("http://localhost:3026/api/users/get-user", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email }),
                    });

                    const userData = await userResponse.json();

                    if (userData.status) {
                        setUser(userData.data);
                    } else {
                        console.log("User not found");
                    }
                } else {
                    console.log("Profile not found");
                }

                const usersResponse = await fetch("http://localhost:3026/api/users", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const usersResult = await usersResponse.json();

                if (usersResult.success) {

                    const getAllUsers = usersResult.result.filter((u) => u.status === "User");
                    setAllUser(getAllUsers);

                    const getAllProviders = usersResult.result.filter((u) => u.status === "Provider");
                    setAllProviders(getAllProviders);

                    const todayRegistrations = usersResult.result.filter((u) => isToday(u.signedUp));
                    setNewRegistration(todayRegistrations)
                }

            } catch (err) {
                console.log("Failed to fetch profile or users", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const recentSignUps = [...allUsers, ...allProviders]
        .sort((a, b) => new Date(b.signedUp) - new Date(a.signedUp))
        .slice(0, 5);

    const totalBookings = 15;

    // Graph
    const totalData = [
        { name: 'Total Users', value: allUsers.length },
        { name: 'Total Providers', value: allProviders.length },
        { name: 'Total Bookings', value: totalBookings },
    ];

    // Top Providers
    const topProviders = [
        {
            id: 1,
            name: "Provider One",
            bookings: 150,
            image: "https://via.placeholder.com/80",
        },
        {
            id: 2,
            name: "Provider Two",
            bookings: 120,
            image: "https://via.placeholder.com/80",
        },
        {
            id: 3,
            name: "Provider Three",
            bookings: 100,
            image: "https://via.placeholder.com/80",
        },
    ];

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

    if (!user) {
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
                <Typography variant="h5" className="font-lora" color="error">
                    Oops! No user data available.
                </Typography>
                <Typography variant="body1" className="font-lora" mt={2}>
                    Please ensure you have the correct permissions to view this information.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <h2 className="text-lg md:text-xl lg:text-2xl font-lora font-bold text-gray-900 mt-3">Welcome back, {user?.name}</h2>
            <p className="text-xs md:text-sm lg:text-base font-lora text-gray-600 mt-2">Here&apos;s what&apos;s happening on your platform today</p>

            <h4 className="text-lg md:text-xl lg:text-2xl font-lora font-bold text-gray-900 mb-4 mt-10">
                Quick Stats Overview :
            </h4>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                    <StatCard title="Total Users" value={allUsers?.length} icon={<PeopleIcon />} />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                    <StatCard title="Total Providers" value={allProviders?.length} icon={<BusinessCenterIcon />} />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                    <StatCard title="New Registrations" value={newRegistration?.length} icon={<PersonAddIcon />} />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                    <StatCard title="Total Events" value="92" icon={<EventAvailableIcon />} />
                </Grid>
            </Grid>

            {/* Recent Activities Section */}
            <Box mt={6}>
                <h4 className="text-lg md:text-xl lg:text-2xl font-lora font-bold text-gray-900 mb-3">Recent Activities / Notifications :</h4>

                {/* Recent Registrations */}
                <Paper
                    elevation={4}
                    sx={{
                        mt: 2,
                        p: 3,
                        borderRadius: 3,
                        backgroundColor: '#f7f7f7'
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ mb: 2, color: '#333' }}
                        className="font-lora font-semibold"
                    >
                        Recent Registrations
                    </Typography>
                    <List>
                        {recentSignUps.map((user, index) => (
                            <React.Fragment key={user._id}>
                                <ListItem sx={{ py: 1.5 }}>
                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="body1"
                                                className="font-lora font-medium"
                                                sx={{ color: '#3f51b5', fontWeight: 600 }}
                                            >
                                                {user.name} ({user.status})
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography
                                                variant="body2"
                                                className="font-lora"
                                                sx={{ color: '#555', mt: 0.5 }}
                                            >
                                                Signed up on: {new Date(user.signedUp).toLocaleString()}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                {index < recentSignUps.length - 1 && (
                                    <Divider variant="middle" sx={{ my: 1.5 }} />
                                )}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>

                {/* Upcoming Events */}
                <Paper elevation={4} sx={{ mt: 4, p: 3, borderRadius: 3, backgroundColor: '#f0f8ff' }}>
                    <Typography
                        variant="h6"
                        sx={{ mb: 2, color: '#333' }}
                        className="font-lora font-semibold"
                    >
                        Upcoming Events
                    </Typography>
                    <List>
                        {[
                            { name: "Wedding of Alice & Bob", date: "2024-11-05", provider: "Elegant Events" },
                            { name: "Corporate Gala Night", date: "2024-11-12", provider: "Prime Planners" },
                            { name: "Charity Fundraiser", date: "2024-11-20", provider: "Giving Hearts Co." },
                        ].map((event, index) => (
                            <React.Fragment key={index}>
                                <ListItem sx={{ py: 1.5 }}>
                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="body1"
                                                className="font-lora font-medium"
                                                sx={{ color: '#3f51b5', fontWeight: 600 }}
                                            >
                                                {event.name}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography
                                                variant="body2"
                                                className="font-lora"
                                                sx={{ color: '#555', mt: 0.5 }}
                                            >
                                                Date: {event.date} | Provider: {event.provider}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                {index < 2 && <Divider variant="middle" sx={{ my: 1.5 }} />}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>

                {/* Reports */}
                <Paper elevation={4} sx={{ mt: 4, p: 3, borderRadius: 3, backgroundColor: '#fff7f7' }}>
                    <Typography
                        variant="h6"
                        sx={{ mb: 2, color: '#333' }}
                        className="font-lora font-semibold"
                    >
                        Reports
                    </Typography>
                    <List>
                        {[
                            { issue: "Unauthorized access attempt detected", date: "2024-10-24", severity: "High" },
                            { issue: "Feedback from user regarding delay in event confirmation", date: "2024-10-23", severity: "Medium" },
                            { issue: "Event data sync issue reported by provider", date: "2024-10-21", severity: "Low" },
                        ].map((report, index) => (
                            <React.Fragment key={index}>
                                <ListItem sx={{ py: 1.5 }}>
                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="body1"
                                                className="font-lora font-medium"
                                                sx={{ color: '#3f51b5', fontWeight: 600 }}
                                            >
                                                {report.issue}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography
                                                variant="body2"
                                                className="font-lora"
                                                sx={{ color: '#555', mt: 0.5 }}
                                            >
                                                Date: {report.date} | Severity: {report.severity}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                {index < 2 && <Divider variant="middle" sx={{ my: 1.5 }} />}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            </Box>

            {/* Graph of total users, providers and bookings */}
            <Box mt={6}>
                <h4 className="text-lg md:text-xl lg:text-2xl font-lora font-bold text-gray-900 mb-5">
                    Graphical Data Insights :
                </h4>

                {/* Total Comparison Chart */}
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                    <Typography
                        variant="h6"
                        className="font-lora font-semibold"
                        sx={{ mb: 2 }}
                    >
                        Total Users, Providers, and Bookings
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={totalData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ className: "font-lora" }} />
                            <YAxis tick={{ className: "font-lora" }} />
                            <Tooltip contentStyle={{ fontFamily: 'Lora', color: '#3f51b5' }} />
                            <Bar dataKey="value" fill="#3f51b5" />
                        </BarChart>
                    </ResponsiveContainer>
                    <Box textAlign="center" mt={2}>
                        {totalData.map((entry, index) => (
                            <Typography
                                key={index}
                                variant="body2"
                                className="font-lora"
                                sx={{ color: '#3f51b5' }}
                            >
                                {entry.name}: {entry.value}
                            </Typography>
                        ))}
                    </Box>
                </Paper>
            </Box>

            {/* Top Providers */}
            <Box mt={6}>
                <h4 className="text-lg md:text-xl lg:text-2xl font-lora font-bold text-gray-900 mb-5">Top Performing Providers :</h4>
                <Grid container spacing={4}>
                    {topProviders.map(provider => (
                        <Grid item xs={12} sm={6} md={4} key={provider.id}>
                            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
                                <Avatar alt={provider.name} src={provider.image} sx={{ width: 80, height: 80, margin: '0 auto' }} />
                                <Typography variant="h6" className="font-lora font-semibold mt-2">
                                    {provider.name}
                                </Typography>
                                <Typography variant="body2" className="font-lora" color="text.secondary">
                                    Total Bookings: {provider.bookings}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Quick action */}
            <Box mt={6}>
                <h4 className="text-lg md:text-xl lg:text-2xl font-lora font-bold text-gray-900 mb-5">Quick Actions :</h4>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} sm={4}>
                            <Link href="/events" passHref>
                                <Button variant="outlined" color="primary" fullWidth sx={{ padding: 1, fontSize: '0.875rem' }} className="font-lora">
                                    Events
                                </Button>
                            </Link>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Link href="/approve-posts" passHref>
                                <Button variant="outlined" color="secondary" fullWidth sx={{ padding: 1, fontSize: '0.875rem' }} className="font-lora">
                                    Approve Posts
                                </Button>
                            </Link>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Link href="/reports" passHref>
                                <Button variant="outlined" color="success" fullWidth sx={{ padding: 1, fontSize: '0.875rem' }} className="font-lora">
                                    View Reports
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Box>
    );
};

export default AdminDashboardUI;


// StatCard Component
const StatCard = ({ title, value, icon }) => {
    return (
        <Paper
            elevation={3}
            sx={{
                padding: 2,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: '0.3s',
                '&:hover': { boxShadow: 6 }
            }}
        >
            <Box>
                <h5 className="text-sm lg:text-lg font-lora font-semibold mb-2">
                    {title}
                </h5>
                <Typography variant="h4" className="font-lora" sx={{ fontWeight: 'bold' }}>
                    {value}
                </Typography>
            </Box>
            <Box sx={{ fontSize: '40px', color: '#3f51b5' }}>
                {icon}
            </Box>
        </Paper>
    );
};