"use client";

import { ExpandLess, ExpandMore } from '@mui/icons-material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BuildIcon from '@mui/icons-material/Build';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DateRangeIcon from '@mui/icons-material/DateRange';
import EventIcon from '@mui/icons-material/Event';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GroupIcon from '@mui/icons-material/Group';
import HandshakeIcon from '@mui/icons-material/Handshake';
import HouseIcon from '@mui/icons-material/House';
import LogoutIcon from '@mui/icons-material/Logout';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ReportIcon from '@mui/icons-material/Report';
import ReviewsIcon from '@mui/icons-material/Reviews';
import SettingsIcon from '@mui/icons-material/Settings';
import { Alert, Box, CircularProgress, Collapse, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Snackbar, Toolbar, Typography } from '@mui/material';
import axios from 'axios';
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';

const adminMenu = [
    { route: "Dashboard", pathName: "/dashboard/admin", icon: DashboardIcon },
    { route: "Users", pathName: "/dashboard/admin/users", icon: GroupIcon },
    { route: "Providers", pathName: "/dashboard/admin/providers", icon: GroupIcon },
    { route: "Events", pathName: "/dashboard/admin/events", icon: EventIcon },
    { route: "Reports", pathName: "/dashboard/admin/reports", icon: ReportIcon },
    { route: "Partners", pathName: "/dashboard/admin/partners", icon: HandshakeIcon },
];

const providerMenu = [
    { route: "Bookings", pathName: "/dashboard/provider/bookings", icon: DateRangeIcon },
    { route: "Availability", pathName: "/dashboard/provider/availability", icon: AccessTimeIcon },
    { route: "Reviews", pathName: "/dashboard/provider/reviews", icon: ReviewsIcon },
];

const userMenu = [
    { route: "Dashboard", pathName: "/dashboard/user", icon: DashboardIcon },
    { route: "Bookings", pathName: "/dashboard/user/bookings", icon: DateRangeIcon },
    { route: "Providers", pathName: "/dashboard/user/providers", icon: GroupIcon },
    { route: "Reviews", pathName: "/dashboard/user/reviews", icon: ReviewsIcon },
    { route: "Wish list", pathName: "/dashboard/user/wishlist", icon: FavoriteIcon },
]

const commonMenu = [
    { route: "Home", pathName: "/", icon: HouseIcon },
    { route: "Settings", pathName: "/dashboard/settings", icon: SettingsIcon },
];

const DashboardMenus = () => {
    const [openServices, setOpenServices] = React.useState(false);
    const [status, setStatus] = React.useState("");
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    React.useEffect(() => {
        const fetchUserEmailAndStatus = async () => {
            try {
                setLoading(true);
                const profileResponse = await fetch("http://localhost:3022/api/users/profile", {
                    method: "POST",
                    credentials: "include",
                });
                const profileData = await profileResponse.json();

                if (profileData.success) {
                    const email = profileData?.result?.email;

                    const usersResponse = await fetch("http://localhost:3022/api/users", {
                        method: "GET",
                        credentials: "include",
                    });
                    const usersData = await usersResponse.json();

                    if (usersData.success) {
                        const user = usersData.result.find(user => user.email === email);

                        if (user) {
                            setStatus(user?.status);
                        } else {
                            console.log("User with the specified email not found");
                        }
                    } else {
                        console.log("Failed to fetch users");
                    }
                } else {
                    console.log("Email not found");
                }
            } catch (err) {
                console.log("Failed to fetch profile or users", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserEmailAndStatus();
    }, []);

    const handleServicesClick = () => {
        setOpenServices(!openServices);
    };

    const pathName = usePathname();

    const isActive = (path) => {
        return pathName === path;
    }

    const handleSignOut = async () => {
        try {
            await axios.get("/api/users/signout");

            setSnackbarSeverity("success");
            setSnackbarMessage("Signed out successfully!");
            router.push("/");
        } catch (error) {
            setSnackbarSeverity("error");
            setSnackbarMessage("Failed to sign out. Please try again.");
        } finally {
            setSnackbarOpen(true);
        }
    };

    // Render loading state or user information
    if (loading) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="40vh"
                textAlign="center"
                p={2}
            >
                <CircularProgress size={30} color="primary" />
                <Typography variant="h6" mt={2} className="font-lora">
                    Loading, please wait...
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <Toolbar>
                <h3 className="text-2xl font-lora font-semibold">Dashboard</h3>
            </Toolbar>
            <Divider />
            <List>
                {/* Admin Menus */}
                {status === "Admin" && (
                    <>
                        {adminMenu?.map((menu) => (
                            <ListItem key={menu.route} disablePadding>
                                <Link href={menu.pathName} className="w-full font-medium font-lora mb-3">
                                    <ListItemButton className={`${isActive(menu.pathName) ? "font-extrabold bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4]" : "hover:bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4] hover:underline"}`}>
                                        <ListItemIcon sx={{ paddingLeft: 1, paddingRight: 2 }}>
                                            <menu.icon />
                                        </ListItemIcon>
                                        {menu.route}
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                        ))}
                    </>
                )}

                {/* Provider Menus */}
                {status === "Provider" && (
                    <>
                        <ListItem disablePadding>
                            <Link href="/dashboard/provider" className="w-full font-medium font-lora mb-3">
                                <ListItemButton className={`${isActive("/dashboard/provider") ? "font-extrabold bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4]" : "hover:bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4] hover:underline"}`}>
                                    <ListItemIcon sx={{ paddingLeft: 1, paddingRight: 2 }}>
                                        <DashboardIcon />
                                    </ListItemIcon>
                                    Dashboard
                                </ListItemButton>
                            </Link>
                        </ListItem>
                        <ListItemButton className='hover:bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4] mb-3' onClick={handleServicesClick} disablePadding>
                            <ListItemIcon sx={{ paddingLeft: 1, paddingRight: 2 }}>
                                <BuildIcon />
                            </ListItemIcon>
                            <ListItemText primary="Services" primaryTypographyProps={{ style: { fontFamily: 'Lora', fontSize: '18px', fontWeight: 500 } }} />
                            {openServices ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={openServices} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <Link href="/dashboard/provider/add-post">
                                    <ListItemButton className={`${isActive("/dashboard/provider/add-post") ? "bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4]" : "hover:bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4] hover:underline"} mb-3`} sx={{ pl: 4 }}>
                                        <ListItemIcon sx={{ paddingLeft: 2, paddingRight: 3 }}>
                                            <PostAddIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Add post" primaryTypographyProps={{ style: { fontFamily: 'Lora', fontSize: '17px', fontWeight: isActive("/dashboard/provider/add-post") ? 600 : 500 } }} />
                                    </ListItemButton>
                                </Link>
                                <Link href="/dashboard/provider/manage-posts">
                                    <ListItemButton className={`${isActive("/dashboard/provider/manage-posts") ? "bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4]" : "hover:bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4] hover:underline"} mb-3`} sx={{ pl: 4 }}>
                                        <ListItemIcon sx={{ paddingLeft: 2, paddingRight: 3 }}>
                                            <FactCheckIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Manage posts" primaryTypographyProps={{ style: { fontFamily: 'Lora', fontSize: '17px', fontWeight: isActive("/dashboard/provider/manage-posts") ? 600 : 500 } }} />
                                    </ListItemButton>
                                </Link>
                                <Link href="/dashboard/provider/add-category">
                                    <ListItemButton className={`${isActive("/dashboard/provider/add-category") ? "bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4]" : "hover:bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4] hover:underline"} mb-3`} sx={{ pl: 4 }}>
                                        <ListItemIcon sx={{ paddingLeft: 2, paddingRight: 3 }}>
                                            <PostAddIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Add category" primaryTypographyProps={{ style: { fontFamily: 'Lora', fontSize: '17px', fontWeight: isActive("/dashboard/provider/add-category") ? 600 : 500 } }} />
                                    </ListItemButton>
                                </Link>
                            </List>
                        </Collapse>
                        {providerMenu?.map((menu) => (
                            <ListItem key={menu.route} disablePadding>
                                <Link href={menu.pathName} className="w-full font-medium font-lora mb-3">
                                    <ListItemButton className={`${isActive(menu.pathName) ? "font-extrabold bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4]" : "hover:bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4] hover:underline"}`}>
                                        <ListItemIcon sx={{ paddingLeft: 1, paddingRight: 2 }}>
                                            <menu.icon />
                                        </ListItemIcon>
                                        {menu.route}
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                        ))}
                    </>
                )}

                {/* User Menus */}
                {status === "User" && (
                    <>
                        {userMenu?.map((menu) => (
                            <ListItem key={menu.route} disablePadding>
                                <Link href={menu.pathName} className="w-full font-medium font-lora mb-3">
                                    <ListItemButton className={`${isActive(menu.pathName) ? "font-extrabold bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4]" : "hover:bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4] hover:underline"}`}>
                                        <ListItemIcon sx={{ paddingLeft: 1, paddingRight: 2 }}>
                                            <menu.icon />
                                        </ListItemIcon>
                                        {menu.route}
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                        ))}
                    </>
                )}

                <Divider />
                {/* Common Menus */}
                {commonMenu?.map((menu) => (
                    <ListItem key={menu.route} disablePadding>
                        <Link href={menu.pathName} className="w-full font-medium font-lora mt-3">
                            <ListItemButton className={`flex items-center ${isActive(menu.pathName) ? "font-extrabold bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4]" : "hover:bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4] hover:underline"}`}>
                                <ListItemIcon sx={{ paddingLeft: 1, paddingRight: 2 }}>
                                    <menu.icon />
                                </ListItemIcon>
                                {menu.route}
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}

                {/* Sign out */}
                <ListItem disablePadding>
                    <ListItemButton onClick={handleSignOut} className="font-lora font-medium mt-3 hover:bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4] hover:underline">
                        <ListItemIcon sx={{ paddingLeft: 1, paddingRight: 2 }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        Sign out
                    </ListItemButton>
                </ListItem>
            </List>

            <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default DashboardMenus;
