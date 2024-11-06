"use client";

import { useState } from "react";
import { Box, Grid, Card, CardMedia, Pagination, PaginationItem } from "@mui/material";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import Link from "next/link";

const CategoryList = ({ categories }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 4;

  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box className="mt-10 px-4">
      <Grid container spacing={4}>
        {currentCategories.map((category, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Link href={`/category/${category.pathName}`}>
              <Card
                elevation={0}
                sx={{
                  height: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              >
                <CardMedia
                  className="rounded-2xl"
                  component="img"
                  height="200"
                  image={category.image}
                  alt={category.name}
                  style={{
                    objectFit: 'cover',
                    transition: "all 0.3s ease-in-out",
                  }}
                  sx={{
                    "&:hover": {
                      boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
                      transform: "scale(1.03)",
                    },
                  }}
                />
                <h4 className="xl:text-xl font-lora font-semibold dark:text-white mt-2">
                  {category.name}
                </h4>
              </Card>
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
              backgroundColor: "#9CA3AF !important",
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

export default CategoryList;
