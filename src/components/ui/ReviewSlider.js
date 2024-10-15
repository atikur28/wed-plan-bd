"use client";

import { useState } from "react";
import { Box, Card, CardContent, IconButton, Avatar } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const ReviewSlider = ({ reviews }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const getPreviousIndex = (index) =>
    index === 0 ? reviews.length - 1 : index - 1;
  const getNextIndex = (index) =>
    index === reviews.length - 1 ? 0 : index + 1;

  return (
    <Box className="relative w-full flex flex-col justify-center items-center mt-10">
      {/* Left Transparent Review */}
      <Box
        className="absolute left-1/4 transform -translate-x-1/2 p-4 shadow-lg transition-opacity duration-300 hidden lg:block"
        style={{
          opacity: 0.3,
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <Card className="shadow-lg p-4 bg-[#f3f3f3] dark:bg-dark">
          <CardContent className="flex flex-col items-center text-center">
            <Avatar
              src={reviews[getPreviousIndex(activeIndex)].image}
              alt={reviews[getPreviousIndex(activeIndex)].name}
              sx={{ width: 50, height: 50, mb: 2 }}
              className="rounded-full"
            />
            <h5 className="text-lg font-lora font-semibold dark:text-white">
              {reviews[getPreviousIndex(activeIndex)].name}
            </h5>
            <p className="text-sm font-lora mt-2 dark:text-white">
              {reviews[getPreviousIndex(activeIndex)].review}
            </p>
            <p className="text-sm font-lora font-semibold text-gray-500 mt-2 block dark:text-white">
              Booked: {reviews[getPreviousIndex(activeIndex)].recommendation}
            </p>
            <p className="text-sm font-lora font-semibold text-gray-500 mt-2 block dark:text-white">
              Recommended to try: {reviews[getPreviousIndex(activeIndex)].recommendPerson}
            </p>
          </CardContent>
        </Card>
      </Box>

      {/* Main Review (Active) */}
      <Box
        className="relative z-20 p-4 shadow-xl transition-opacity duration-300"
        style={{
          opacity: 1,
          width: "100%",
          maxWidth: "650px",
        }}
      >
        <Card className="shadow-lg p-4 bg-[#d6d6d6] dark:bg-dark">
          <CardContent className="flex flex-col items-center text-center">
            <Avatar
              src={reviews[activeIndex].image}
              alt={reviews[activeIndex].name}
              sx={{ width: 70, height: 70, mb: 2 }}
              className="rounded-full"
            />
            <h5 className="text-lg font-lora font-semibold dark:text-white">
              {reviews[activeIndex].name}
            </h5>
            <p className="text-sm font-lora mt-2 dark:text-white">
              {reviews[activeIndex].review}
            </p>
            <p className="text-sm font-lora font-semibold text-gray-500 mt-2 block dark:text-white">
              Booked: {reviews[activeIndex].recommendation}
            </p>
            <p className="font-lora font-semibold text-gray-500 mt-2 block dark:text-white">
              Recommended to try: {reviews[activeIndex].recommendPerson}
            </p>

            {/* Navigation Buttons for Mobile */}
            <Box
              className="flex justify-center lg:hidden w-full mt-4 absolute bottom-2 left-1/2 transform -translate-x-1/2"
            >
              <IconButton onClick={handlePrev} className="text-gray-500 dark:text-white mr-2">
                <ArrowBackIos />
              </IconButton>
              <IconButton onClick={handleNext} className="text-gray-500 dark:text-white ml-2">
                <ArrowForwardIos />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Right Transparent Review */}
      <Box
        className="absolute right-1/4 transform translate-x-1/2 p-4 shadow-lg transition-opacity duration-300 hidden lg:block"
        style={{
          opacity: 0.3,
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <Card className="shadow-lg p-4 bg-[#f3f3f3] dark:bg-dark">
          <CardContent className="flex flex-col items-center text-center">
            <Avatar
              src={reviews[getNextIndex(activeIndex)].image}
              alt={reviews[getNextIndex(activeIndex)].name}
              sx={{ width: 50, height: 50, mb: 2 }}
              className="rounded-full"
            />
            <h5 className="text-lg font-lora font-semibold dark:text-white">
              {reviews[getNextIndex(activeIndex)].name}
            </h5>
            <p className="text-sm font-lora mt-2 dark:text-white">
              {reviews[getNextIndex(activeIndex)].review}
            </p>
            <p className="text-sm font-lora font-semibold text-gray-500 mt-2 block dark:text-white">
              Booked: {reviews[getNextIndex(activeIndex)].recommendation}
            </p>
            <p className="text-sm font-lora font-semibold text-gray-500 mt-2 block dark:text-white">
              Recommended to try: {reviews[getNextIndex(activeIndex)].recommendPerson}
            </p>
          </CardContent>
        </Card>
      </Box>

      {/* Navigation Buttons for Larger Devices */}
      <Box className="hidden lg:flex justify-between items-center w-full mt-0 absolute top-1/2 transform -translate-y-1/2 px-28 lg:px-[80px] xl:px-[150px] 2xl:px-[250px]"
      >
        <IconButton onClick={handlePrev} className="text-gray-500 dark:text-white">
          <ArrowBackIos />
        </IconButton>
        <IconButton onClick={handleNext} className="text-gray-500 dark:text-white">
          <ArrowForwardIos />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ReviewSlider;
