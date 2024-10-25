"use client";

import AddIcon from '@mui/icons-material/Add';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from '@mui/icons-material/Search';
import { Alert, Box, IconButton, InputAdornment, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Link from 'next/link';
import * as React from 'react';

const AdminUsers = () => {
    const [users, setUsers] = React.useState([]);
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("name");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage] = React.useState(20);
    const [searchQuery, setSearchQuery] = React.useState("");

    const [alertOpen, setAlertOpen] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState("");
    const [alertType, setAlertType] = React.useState("success");

    React.useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersResponse = await fetch("http://localhost:3021/api/users", {
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
            }
        };
        fetchUsers();
    }, []);

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
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
        if (orderBy === "name" || orderBy === "email" || orderBy === "userCategory") {
            return (a[orderBy].localeCompare(b[orderBy])) * (order === "asc" ? 1 : -1);
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

    const handleConvertToAdmin = async (event, userId) => {
        event.stopPropagation();
        try {
            const userInfo = await users?.filter(user => user._id === userId);
            const updatedUserInfo = {
                name: userInfo[0]?.name,
                image: userInfo[0]?.image,
                email: userInfo[0]?.email,
                userCategory: userInfo[0]?.userCategory,
                status: "Admin"
            };
            const userResponse = await fetch("http://localhost:3021/api/users/profile/update-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUserInfo),
            });

            const userResult = await userResponse.json();

            if (userResult.success) {
                setAlertMessage("User converted to Admin successfully!");
                setAlertType("success");
                setAlertOpen(true);
            } else {
                console.log("Failed to converted User to Admin");
                setAlertMessage("Failed to converted User to Admin.");
                setAlertType("error");
                setAlertOpen(true);
            }
        } catch (error) {
            console.error('Error converting user:', error);
        }
    };

    const handleDeleteUser = async (event, userId) => {
        event.stopPropagation();
        if (confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await fetch(`http://localhost:3021/api/users/delete/${userId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                const data = await response.json();

                if (data.success) {
                    console.log('User deleted successfully');
                    setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
                } else {
                    console.log('Failed to delete user', data.message);
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <Box className="mx-2 md:mx-3 lg:mx-0 lg:mr-4">
            <h3 className="text-xl lg:text-2xl font-lora font-semibold text-gray-900 mt-2">User management</h3>
            <p className="text-sm lg:text-base font-lora font-medium text-gray-700 mt-2">Manage your team members and their account permissions here.</p>
            <Box className="md:flex md:justify-between md:items-center md:mr-2 mt-5">
                <h4 className="lg:text-lg font-lora font-semibold text-gray-900">All users ({filteredUsers.length})</h4>
                <Box className="flex justify-center items-center gap-5 mt-5 md:mt-0">
                    <TextField
                        placeholder="Search by email"
                        variant="outlined"
                        className="w-[195px] md:w-[300px] font-lora"
                        InputLabelProps={{
                            className: 'font-lora text-gray-800',
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon className="text-gray-500" />
                                </InputAdornment>
                            ),
                            className: 'font-lora text-gray-800',
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
                                    padding: '6px 6px',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                top: '-5px',
                            },
                        }}
                    />
                    <Link href="/signup">
                        <p className="text-xs lg:text-base flex justify-center items-center gap-1 font-lora text-white bg-black rounded-lg py-1 md:py-[6px] px-[5px] md:px-3 transition-all duration-200 ease-in-out active:scale-90 select-none">
                            <AddIcon />Add user
                        </p>
                    </Link>
                </Box>
            </Box>
            {/* Table */}
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table aria-label="user table">
                    <TableHead>
                        <TableRow style={{ backgroundColor: "#1F2937" }}>
                            {["Username", "Email", "Access", "Date added", "Action"].map((headCell, index) => {
                                const property = ["name", "email", "userCategory", "signedUp", "action"][index];
                                return (
                                    <TableCell
                                        key={headCell}
                                        sortDirection={orderBy === property ? order : false}
                                        sx={{ color: "white", fontFamily: "Lora" }}
                                    >
                                        <TableSortLabel
                                            active={orderBy === property}
                                            direction={orderBy === property ? order : "asc"}
                                            onClick={() => handleRequestSort(property)}
                                            sx={{
                                                color: "white !important",
                                                fontFamily: "Lora",
                                                '&:hover': { color: "white !important" },
                                                '& .MuiTableSortLabel-icon': {
                                                    color: orderBy === property ? "white !important" : "#1F2937",
                                                },
                                                '&.Mui-active .MuiTableSortLabel-icon': {
                                                    color: "white !important",
                                                },
                                            }}
                                        >
                                            {headCell}
                                        </TableSortLabel>
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedUsers.length > 0 ? (
                            paginatedUsers.map((user) => {
                                return (
                                    <TableRow key={user._id} hover>
                                        <TableCell sx={{ display: "flex", alignItems: "center", fontFamily: "Lora" }}>
                                            {user.image ? (
                                                <Avatar src={user.image} alt={user.name} />
                                            ) : (
                                                <Avatar>
                                                    <PersonIcon />
                                                </Avatar>
                                            )}
                                            <span className="ml-2">{user.name}</span>
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: "Lora" }}>{user.email}</TableCell>
                                        <TableCell sx={{ fontFamily: "Lora" }}>{user.status}</TableCell>
                                        <TableCell sx={{ fontFamily: "Lora" }}>{user.signedUp.split("T")[0]}</TableCell>
                                        <TableCell>
                                            {/* Action Buttons */}
                                            {user.status === "User" && (
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <IconButton
                                                        onClick={(event) => handleConvertToAdmin(event, user._id)}
                                                        title="Make Admin from User"
                                                        color="primary"
                                                        sx={{ fontSize: '1.5rem' }}
                                                    >
                                                        <AdminPanelSettingsIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={(event) => handleDeleteUser(event, user._id)}
                                                        title="Delete User"
                                                        color="error"
                                                        sx={{ fontSize: '1.5rem' }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ fontFamily: "Lora" }}>
                                    No users found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[20, 50, 100]}
                component="div"
                count={filteredUsers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                labelDisplayedRows={({ from, to, count }) => (
                    <span style={{ fontFamily: "Lora" }}>{`Showing ${from}-${to} of ${count}`}</span>
                )}
                labelRowsPerPage={
                    <span style={{ fontFamily: "Lora" }}>Rows per page:</span>
                }
                sx={{
                    fontFamily: "Lora",
                    '& .MuiTablePagination-selectLabel': {
                        fontFamily: 'Lora',
                    },
                    '& .MuiTablePagination-displayedRows': {
                        fontFamily: 'Lora',
                    },
                    '& .MuiTablePagination-actions button': {
                        fontFamily: 'Lora',
                    },
                    '& .MuiTablePagination-select': {
                        fontFamily: 'Lora',
                    },
                }}
            />

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

export default AdminUsers;