import { Gupter, Lora } from "next/font/google";
import "./globals.css";

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
      <body className={`${lora.variable} ${gupter.variable} dark:bg-medium max-w-[2560px] mx-auto`}>
        <section className="min-h-[70vh]">
          {children}
        </section>
      </body>
    </html>
  );
}
