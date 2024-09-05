import { Lora, Gupter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/sharedUI/Navbar";
import { Button, styled } from "@mui/material";
import Link from "next/link";
import Footer from "@/components/sharedUI/Footer";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora"
});

const gupter = Gupter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-gupter"
});

export const metadata = {
  title: "WedPlan BD",
  description: "Plan your perfect wedding with ease—venues, photographers, and more, all in one place.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${lora.variable} ${gupter.variable} dark:bg-medium max-w-[2440px] mx-auto`}>
        <Navbar />
        <section className="min-h-[80vh]">
          {children}
        </section>
        <Footer />
      </body>
    </html>
  );
}
