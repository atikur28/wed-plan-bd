"use client";

import communityCenter from "@/assets/slider/community-center.png";
import decoration from "@/assets/slider/decoration.png";
import honeymoon from "@/assets/slider/honeymoon-plan.png";
import photographer from "@/assets/slider/photography.png";
import camera from "@/assets/slider/camera.png";
import food from "@/assets/slider/food-1.png";
import food2 from "@/assets/slider/food-2.png";
import { Box, Button } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const CustomSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 4); // 4 slides
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 4);
    } else if (touchStartX.current - touchEndX.current < -50) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + 4) % 4);
    }
  };

  const handleMouseDown = (e) => {
    touchStartX.current = e.clientX;
  };

  const handleMouseMove = (e) => {
    touchEndX.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 4);
    } else if (touchStartX.current - touchEndX.current < -50) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + 4) % 4);
    }
  };

  return (
    <Box
      className="relative w-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Static Slider Content */}
      <Box className="relative overflow-hidden w-full h-40 md:h-60 lg:h-[80vh]">
        {/* Slide 1: Photography */}
        <Box
          className={`absolute transition-opacity duration-1000 ease-in-out ${
            currentIndex === 0 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          style={{
            backgroundImage: `url(${photographer.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Box className="flex justify-evenly items-center h-full">
            <Box className="w-[150px] md:w-[200px] lg:w-[350px] xl:w-[600px] mx-2 md:mx-0">
              <Image className="select-none" src={camera} width={600} height={600} alt="Camera" />
            </Box>
            <Box>
              <h1>
                <span className="bg-[#ffe500] md:text-4xl xl:text-8xl text-black font-lora font-semibold pl-5 select-none">
                  PHOTO
                </span>
                <span className="md:text-4xl xl:text-8xl text-white font-lora font-semibold border-b-4 border-[#ffe500] ml-0.5 select-none">
                  GRAPHY
                </span>
              </h1>
              <p className="text-[10px] md:text-xl xl:text-3xl font-lora font-medium text-white mt-3 lg:mt-10 mb-2 lg:mb-7 md:max-w-[450px] lg:max-w-[600px] select-none">
                Capture every beautiful moment with our professional
                photographers.
              </p>
              <Link href="/category/photography">
                <Button className="text-[10px] md:text-base px-4 bg-white text-black font-semibold font-lora select-none">
                  Photographer
                </Button>
              </Link>
            </Box>
          </Box>
        </Box>

        {/* Slide 2: Honeymoon Plan */}
        <Box
          className={`absolute transition-opacity duration-1000 ease-in-out ${
            currentIndex === 1 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          style={{
            backgroundImage: `url(${honeymoon.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Box className="flex items-center pl-3 lg:pl-10 h-full bg-black bg-opacity-30">
            <Box>
              <h1 className="md:text-4xl xl:text-8xl text-white font-lora font-semibold select-none">
                Honeymoon Plan
              </h1>
              <p className="text-[10px] md:text-xl xl:text-3xl font-lora font-medium text-white mt-3 lg:mt-10 mb-2 lg:mb-7 md:max-w-[450px] lg:max-w-[600px] select-none">
                Plan the perfect honeymoon with our exclusive packages.
              </p>
              <Link href="/category/travel">
                <Button className="text-[10px] md:text-base px-4 bg-white text-black font-semibold font-lora select-none">
                  Travel
                </Button>
              </Link>
            </Box>
          </Box>
        </Box>

        {/* Slide 3: Food */}
        <Box
          className={`absolute transition-opacity duration-1000 ease-in-out ${
            currentIndex === 2 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          style={{
            backgroundImage: `url(${communityCenter.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Box className="flex justify-evenly items-center h-full">
            <Image
              className="w-[80px] md:w-[150px] lg:w-[300px] xl:w-[400px] select-none"
              src={food}
              width={400}
              height={400}
              alt="Food"
            />
            <Box className="flex flex-col max-w-[200px] md:max-w-[400px] lg:max-w-[650px]">
              <Box>
                <h2 className="text-[12px] md:text-xl lg:text-2xl 2xl:text-5xl font-lora font-semibold text-start text-[#60422d] select-none">
                  WHAT – The Wedding Food and Drink
                </h2>
                <p className="text-[8px] md:text-[12px] lg:text-[14px] 2xl:text-xl text-start font-lora font-medium text-[#60422d] lg:mt-3 xl:mt-5 lg:mb-2 xl:mb-10 select-none">
                  Delight your guests with exquisite cuisine and crafted
                  cocktails! Choose from elegant hors d&apos;oeuvres, a stunning
                  wedding cake, and a personalized menu that reflects your
                  taste.
                </p>
              </Box>
              <Image
                className="w-[60px] md:w-[150px] lg:w-[250px] xl:w-[400px] select-none"
                src={food2}
                width={300}
                height={300}
                alt="Food"
              />
            </Box>
          </Box>
        </Box>

        {/* Slide 4: Decoration */}
        <Box
          className={`absolute transition-opacity duration-1000 ease-in-out ${
            currentIndex === 3 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          style={{
            backgroundImage: `url(${decoration.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Box className="flex flex-col justify-center h-full md:max-w-[500px] xl:max-w-[800px] ml-2 xl:ml-20">
            <h1 className="text-[14px] md:text-xl lg:text-2xl xl:text-5xl font-lora font-semibold text-white select-none">
              Transform Your Wedding with Stunning Decor!
            </h1>
            <p className="text-[10px] md:text-[14px] xl:text-2xl text-start font-lora font-medium text-white mt-3 xl:mt-10 mb-2 xl:mb-16 select-none">
              Delight your guests with exquisite cuisine and crafted cocktails!
              Choose from elegant hors d&apos;oeuvres, a stunning wedding cake,
              and a personalized menu that reflects your taste. Make your
              celebration unforgettable with a feast that tantalizes the senses!
            </p>
            <Link href="/category/decoration">
              <Button className="text-[10px] md:text-base px-4 bg-white text-black font-semibold font-lora w-max">
                Decoration
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>

      {/* Dot Indicators */}
      <Box className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {[0, 1, 2, 3].map((index) => (
          <Box
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              currentIndex === index ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CustomSlider;
