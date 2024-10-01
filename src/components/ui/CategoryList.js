"use client";

import { useState } from "react";
import { Box, Grid, Card, CardMedia, Typography, Pagination } from "@mui/material";
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
              <Card elevation={0}>
                <CardMedia
                  className="rounded-lg"
                  component="img"
                  height="140"
                  image={category.image}
                  alt={category.name}
                />
              </Card>
              <Typography className="xl:text-xl font-lora font-semibold mt-2" component="div">
                {category.name}
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
          sx={{
            "& .MuiPaginationItem-root": {
              fontFamily: "'Lora', serif",
              fontWeight: "bold",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default CategoryList;
