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
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ReportIcon from '@mui/icons-material/Report';
import ReviewsIcon from '@mui/icons-material/Reviews';
import SettingsIcon from '@mui/icons-material/Settings';
import { Alert, Box, Button, Collapse, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Snackbar, Toolbar } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
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

const DashboardDrawer = () => {
    const [open, setOpen] = React.useState(false);
    const [status, setStatus] = React.useState("");
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
    const router = useRouter();

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    React.useEffect(() => {
        const fetchUserEmailAndStatus = async () => {
            try {
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
            }
        };

        fetchUserEmailAndStatus();
    }, []);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const [openServices, setOpenServices] = React.useState(false);

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

    const DrawerList = (
        <Box sx={{ width: 270, backgroundColor: "#f5f5f5", height: "100%" }} role="presentation" >
            <Toolbar className="flex justify-between items-center">
                <h3 className="text-2xl font-lora font-semibold">Dashboard</h3>
                <MenuOpenIcon sx={{ fontSize: "32px", color: "black", cursor: "pointer" }} onClick={toggleDrawer(false)} />
            </Toolbar>
            <Divider />
            <List>
                {/* Admin Menus */}
                {status === "Admin" && (
                    <>
                        {adminMenu?.map((menu, index) => (
                            <ListItem key={menu.route} disablePadding>
                                <Link href={menu.pathName} className="w-full font-medium font-lora mb-3">
                                    <ListItemButton className={`${isActive(menu.pathName) ? `font-extrabold bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4]` : `hover:bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4] hover:underline`}`} onClick={toggleDrawer(false)}>
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
                        {/* Dashboard Link */}
                        <ListItem disablePadding>
                            <Link href="/dashboard/provider" className="w-full font-medium font-lora mb-3">
                                <ListItemButton className={`${isActive("/dashboard/provider") ? `font-extrabold bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4]` : `hover:bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4] hover:underline`}`} onClick={toggleDrawer(false)}>
                                    <ListItemIcon sx={{ paddingLeft: 1, paddingRight: 2 }}>
                                        <DashboardIcon />
                                    </ListItemIcon>
                                    Dashboard
                                </ListItemButton>
                            </Link>
                        </ListItem>
                        {/* Services Link */}
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
                                    <ListItemButton className={`hover:bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4] hover:underline mb-3 ${isActive("/dashboard/provider/add-post") ? `bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4]` : ``}`} sx={{ pl: 4 }}
                                        onClick={toggleDrawer(false)}>
                                        <ListItemIcon sx={{ paddingLeft: 2, paddingRight: 3 }}>
                                            <PostAddIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Add post" primaryTypographyProps={{ style: { fontFamily: 'Lora', fontSize: '17px', fontWeight: isActive("/dashboard/provider/add-post") ? 600 : 500 } }} />
                                    </ListItemButton>
                                </Link>
                                <Link href="/dashboard/provider/manage-posts">
                                    <ListItemButton className={`hover:bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4] hover:underline mb-3 ${isActive("/dashboard/provider/manage-posts") ? `bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4]` : ``}`} sx={{ pl: 4 }}
                                        onClick={toggleDrawer(false)}>
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
                        {/* Other Links */}
                        {providerMenu?.map((menu, index) => (
                            <ListItem key={menu.route} disablePadding>
                                <Link href={menu.pathName} className="w-full font-medium font-lora mb-3">
                                    <ListItemButton className={`${isActive(menu.pathName) ? `font-extrabold bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4]` : `hover:bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4] hover:underline`}`} onClick={toggleDrawer(false)}>
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
                        {userMenu?.map((menu, index) => (
                            <ListItem key={menu.route} disablePadding>
                                <Link href={menu.pathName} className="w-full font-medium font-lora mb-3">
                                    <ListItemButton className={`${isActive(menu.pathName) ? `font-extrabold bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4]` : `hover:bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4] hover:underline`}`} onClick={toggleDrawer(false)}>
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
            </List>
            <Divider />
            <List>
                {commonMenu?.map((menu, index) => (
                    <ListItem key={menu.route} disablePadding>
                        <Link href={menu.pathName} className="w-full font-medium font-lora mt-1 mb-2">
                            <ListItemButton className={`${isActive(menu.pathName) ? `font-extrabold bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4]` : `hover:bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4] hover:underline`}`} onClick={toggleDrawer(false)}>
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
                    <ListItemButton onClick={handleSignOut} className="font-lora font-medium mt-2 hover:bg-gradient-to-r from-[#e1e1e1] to-[#c4c4c4] hover:underline">
                        <ListItemIcon sx={{ paddingLeft: 1, paddingRight: 2 }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        Sign out
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box className="flex justify-start items-center gap-5 lg:hidden py-2.5 shadow-md">
            <Button onClick={toggleDrawer(true)}><MenuIcon sx={{ fontSize: "32px", color: "black" }} /></Button>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
            <h3 className="text-2xl font-lora font-semibold">WedPlan BD</h3>

            <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box >
    );
};

export default DashboardDrawer;