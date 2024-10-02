"use client";

import { useState } from "react";
import { Box, Grid, Card, CardMedia, Typography, Pagination, PaginationItem } from "@mui/material";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import Link from "next/link";

const CenterList = ({ centers }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const centersPerPage = 4;

    const totalPages = Math.ceil(centers.length / centersPerPage);

    const indexOfLastCenter = currentPage * centersPerPage;
    const indexOfFirstCenter = indexOfLastCenter - centersPerPage;
    const currentCenters = centers.slice(indexOfFirstCenter, indexOfLastCenter);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <Box className="mt-10 px-4">
            <Grid container spacing={4}>
                {currentCenters.map((center, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Link href={center._id}>
                            <Card elevation={0}>
                                <CardMedia
                                    className="rounded-2xl"
                                    component="img"
                                    height="140"
                                    image={center.professionImage}
                                    alt={center.professionName}
                                />
                            </Card>
                            <Typography className="xl:text-xl font-lora font-semibold mt-2 dark:text-white" component="div">
                                {center.professionName}
                            </Typography>
                            <Typography className="text-sm font-lora font-semibold mt-1 text-gray-500 dark:text-white">
                                {center.address}
                            </Typography>
                        </Link>
                    </Grid>
                ))}
            </Grid>

            <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    renderItem={(item) => (
                        <PaginationItem
                            slots={{ previous: KeyboardDoubleArrowLeftIcon, next: KeyboardDoubleArrowRightIcon }}
                            {...item}
                        />
                    )}
                    sx={{
                        "& .MuiPaginationItem-root": {
                            fontFamily: "'Lora', serif",
                            fontWeight: "bold",
                            borderRadius: "8px",
                            backgroundColor: "#edf2f7",
                        },
                        "& .Mui-selected": {
                            backgroundColor: "#9CA3AF",
                            color: "#000",
                        },
                        "& .MuiPaginationItem-root:hover": {
                            backgroundColor: "#e2e8f0",
                        },
                    }}
                />
            </Box>
        </Box>
    );
};

export default CenterList;
