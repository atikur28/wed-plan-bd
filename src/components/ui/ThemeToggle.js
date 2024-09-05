"use client";

import React, { useEffect, useState } from "react";
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';

const ThemeToggle = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const theme = localStorage.getItem("theme");
        if (theme === "dark") {
            setDarkMode(false);
        }
    }, [])

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark")
            localStorage.setItem("theme", "dark")
        } else {
            document.documentElement.classList.remove("dark")
            localStorage.setItem("theme", "light")
        }
    }, [darkMode])

    return (
        <section className="relative w-10 md:w-16 h-4 md:h-8 flex items-center dark:bg-gray-900 bg-teal-500 cursor-pointer rounded-full p-1" onClick={() => setDarkMode(!darkMode)}>
            <NightlightIcon className="text-white text-sm md:text-lg" />
            <section className="absolute bg-white w-4 md:w-7 h-4 md:h-7 rounded-full shadow-md transform transition-transform duration-300" style={darkMode ? {left: "2px"} : {right: "2px"}}></section>
            <LightModeIcon className="ml-auto text-yellow-400 text-sm md:text-lg" />
        </section>
    );
};

export default ThemeToggle;
