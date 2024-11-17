"use client";

import AddIcon from "@mui/icons-material/Add";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, InputAdornment, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";
import * as React from "react";

const AdminUsersUI = () => {
    const [users, setUsers] = React.useState([]);
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("name");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage] = React.useState(20);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [loading, setLoading] = React.useState(true);

    // Alert States Code:
    const [alertOpen, setAlertOpen] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState("");
    const [alertType, setAlertType] = React.useState("success");
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = React.useState(false);
    const [selectedUserId, setSelectedUserId] = React.useState(null);

    React.useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const usersResponse = await fetch("http://localhost:3034/api/users", {
                    method: "GET",
                    credentials: "include",
                });
                const usersData = await usersResponse.json();

                if (usersData.success) {
                    const filteredUsers = usersData.result.filter(user => user.status === "User");
                    setUsers(filteredUsers);
                } else {
                    console.log("Failed to fetch!");
                }
            } catch (error) {
                console.log("Failed to fetch users: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Alert Handle Code:
    const handleCloseAlert = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setAlertOpen(false);
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const sortedUsers = users.slice().sort((a, b) => {
        if (orderBy === "name" || orderBy === "email" || orderBy === "status") {
            return a[orderBy].localeCompare(b[orderBy]) * (order === "asc" ? 1 : -1);
        }
        return (new Date(a.signedUp) - new Date(b.signedUp)) * (order === "asc" ? 1 : -1);
    });

    const filteredUsers = sortedUsers.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Convert User to Admin Code:
    const handleConvertToAdmin = async (event, userId) => {
        event.stopPropagation();
        try {
            setLoading(true);
            const userInfo = await users?.filter(user => user._id === userId);
            const updatedUserInfo = {
                name: userInfo[0]?.name,
                image: userInfo[0]?.image,
                email: userInfo[0]?.email,
                userCategory: userInfo[0]?.userCategory,
                status: "Admin",
            };
            const userResponse = await fetch("http://localhost:3034/api/users/profile/update-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUserInfo),
            });

            const userResult = await userResponse.json();

            if (userResult.success) {
                setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
                setAlertMessage("User converted to Admin successfully!");
                setAlertType("success");
                setAlertOpen(true);
            } else {
                console.log("Failed to convert User to Admin");
                setAlertMessage("Failed to convert User to Admin.");
                setAlertType("error");
                setAlertOpen(true);
            }
        } catch (error) {
            console.error("Error converting user:", error);
        } finally {
            setLoading(false);
        }
    };

    // User Delete Code:
    const handleDeleteDialogOpen = (userId) => {
        setSelectedUserId(userId);
        setConfirmDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setConfirmDeleteDialogOpen(false);
        setSelectedUserId(null);
    };

    const handleDeleteUser = async () => {
        if (selectedUserId) {
            try {
                setLoading(true);

                const response = await fetch("http://localhost:3034/api/users/profile/delete-profile", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId: selectedUserId }),
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    setAlertMessage("User deleted successfully!");
                    setAlertType("success");
                    setAlertOpen(true);

                    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== selectedUserId));
                } else {
                    console.error("Failed to delete user:", result.message);
                    setAlertMessage("Failed to delete user!");
                    setAlertType("error");
                    setAlertOpen(true);
                }
            } catch (error) {
                console.error("Error deleting user:", error);
                setAlertMessage("Failed to delete user!");
                setAlertType("error");
                setAlertOpen(true);
            } finally {
                handleDeleteDialogClose();
                setLoading(false);
            }
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

    return (
        <Box>
            <h3 className="text-xl lg:text-2xl font-lora font-semibold text-gray-900 mt-2">User management</h3>
            <p className="text-sm lg:text-base font-lora font-medium text-gray-700 mt-2">Manage your team members and their account permissions here.</p>
            <Box className="md:flex md:justify-between md:items-center md:mr-2 mt-5">
                <h4 className="lg:text-lg font-lora font-semibold text-gray-900">All users ({filteredUsers.length})</h4>
                <Box className="flex justify-center items-center gap-5 mt-5 md:mt-0">
                    <TextField
                        placeholder="Search by email"
                        variant="outlined"
                        className="w-[195px] md:w-[300px] font-lora"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon className="text-gray-500" />
                                </InputAdornment>
                            ),
                        }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#E5E7EB',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#6B7280',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#3e98f2',
                                },
                                '& .MuiOutlinedInput-input': {
                                    fontFamily: 'Lora, serif',
                                    padding: '6px 6px',
                                    '&::placeholder': {
                                        color: 'rgba(0, 0, 0, 0.5)',
                                        fontFamily: 'Lora, serif',
                                    },
                                },
                            },
                            '& .MuiInputLabel-root': {
                                fontFamily: 'Lora, serif',
                                top: '-4px',
                            },
                            '& .MuiInputAdornment-root': {
                                fontFamily: 'Lora, serif',
                            }
                        }}
                    />
                    <Link href="/signup">
                        <p className="text-xs lg:text-base flex justify-center items-center gap-1 font-lora text-white bg-black rounded-lg py-1 md:py-[6px] px-[5px] md:px-3">
                            <AddIcon /> Add user
                        </p>
                    </Link>
                </Box>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table aria-label="user table">
                            <TableHead>
                                <TableRow style={{ backgroundColor: "#1F2937" }}>
                                    {["Username", "Email", "Access", "Verified", "Date Added", "Action"].map((header) => (
                                        <TableCell
                                            key={header}
                                            style={{
                                                color: "white",
                                                fontWeight: "bold",
                                                textAlign: header === "Action" ? "center" : "left",
                                                fontFamily: "Lora, serif",
                                            }}
                                        >
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedUsers.length > 0 ? (
                                    paginatedUsers.map((user) => (
                                        <TableRow key={user._id} hover role="checkbox" tabIndex={-1}>
                                            <TableCell style={{ fontFamily: "Lora, serif" }}>
                                                <Box display="flex" alignItems="center">
                                                    <Avatar alt={user.name} src={user.image} sx={{ width: 24, height: 24, marginRight: 1 }} />
                                                    {user.name}
                                                </Box>
                                            </TableCell>
                                            <TableCell style={{ fontFamily: "Lora, serif" }}>{user.email}</TableCell>
                                            <TableCell style={{ fontFamily: "Lora, serif" }}>
                                                <span className="flex items-center">
                                                    {user.status === "Admin" ? <AdminPanelSettingsIcon className="mr-1" /> : <PersonIcon className="mr-1" />}
                                                    {user.status}
                                                </span>
                                            </TableCell>
                                            <TableCell style={{ fontFamily: "Lora, serif" }}>
                                                <span
                                                    style={{
                                                        color: user.isVerified ? "green" : "red",
                                                        border: `2px solid ${user.isVerified ? "green" : "red"}`,
                                                        borderRadius: "12px",
                                                        padding: "4px 8px",
                                                        display: "inline-block",
                                                    }}
                                                >
                                                    {user.isVerified ? "Verified" : "Not Verified"}
                                                </span>
                                            </TableCell>
                                            <TableCell style={{ fontFamily: "Lora, serif" }}>{new Date(user.signedUp).toLocaleDateString()}</TableCell>
                                            <TableCell style={{ textAlign: "center", fontFamily: "Lora, serif" }}>
                                                <IconButton title="User to Admin" color="secondary" onClick={(e) => handleConvertToAdmin(e, user._id)}>
                                                    <AdminPanelSettingsIcon />
                                                </IconButton>
                                                <IconButton title="Delete user" color="error" onClick={() => handleDeleteDialogOpen(user._id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" style={{ fontFamily: "Lora, serif", padding: "20px" }}>
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={filteredUsers.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        labelRowsPerPage=""
                        rowsPerPageOptions={[]}
                        labelDisplayedRows={({ from, to, count }) => (
                            <span style={{ fontFamily: "Lora" }}>{`Showing ${from}-${to} of ${count}`}</span>
                        )}
                    />
                </>
            )}

            <Snackbar open={alertOpen} autoHideDuration={5000} onClose={handleCloseAlert} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <Alert onClose={handleCloseAlert} severity={alertType} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>

            <Dialog open={confirmDeleteDialogOpen} onClose={handleDeleteDialogClose}>
                <DialogTitle sx={{ fontFamily: "Lora, serif" }}>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontFamily: "Lora, serif" }}>
                        Are you sure you want to delete this user? This action is irreversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose} color="primary" sx={{ fontFamily: "Lora, serif" }}>
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteUser} color="error" sx={{ fontFamily: "Lora, serif" }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminUsersUI;