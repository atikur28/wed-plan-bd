import advertise2 from "@/assets/home/advertise-image-2.png";
import advertise from "@/assets/home/advertise-image.png";
import Footer from "@/components/sharedUI/Footer";
import Navbar from "@/components/sharedUI/Navbar";
import CategoryList from "@/components/ui/CategoryList";
import CenterList from "@/components/ui/CenterList";
import CustomSlider from "@/components/ui/CustomSlider";
import ReviewSlider from "@/components/ui/ReviewSlider";
import { Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

const getCategories = async () => {
  const res = await fetch("http://localhost:3026/api/categories");
  const data = await res.json();
  return data.result;
}

const popularCenters = async () => {
  const res = await fetch("http://localhost:3026/api/posts");
  const data = await res.json();

  if (!data.success) {
    console.error("Failed to fetch data:", data.message);
    return [];
  }

  const filteredData = data.result
    .filter((f) => f.status === "centers")
    .sort((a, b) => b.liked.length - a.liked.length);

  return filteredData;
};

const getReviews = async () => {
  const res = await fetch("http://localhost:3026/api/reviews");
  const data = await res.json();
  return data.result;
}

export default async function Home() {
  const categories = await getCategories();
  const centers = await popularCenters();
  const reviews = await getReviews();

  return (
    <>
      <Navbar />
      <main className="mt-8">
        <CustomSlider />

        {/* Browse By Category */}
        <section className="w-[98%] lg:w-[95%] xl:w-4/5 mx-auto my-10">
          <Box className="flex justify-between items-center">
            <h3 className="md:text-lg xl:text-2xl font-lora font-semibold dark:text-white">Browse By Category</h3>
            <p className="text-sm md:text-base font-lora font-semibold dark:text-white">View All ({categories.length})</p>
          </Box>
          {/* Category Lists */}
          <CategoryList categories={categories} />
        </section>

        {/* Popular Centers */}
        <section className="w-[98%] lg:w-[95%] xl:w-4/5 mx-auto my-10">
          <Box className="flex justify-between items-center">
            <h3 className="md:text-lg xl:text-2xl font-lora font-semibold dark:text-white">Popular Centers</h3>
            <p className="text-sm md:text-base font-lora font-semibold dark:text-white">View All (100)</p>
          </Box>
          {/* Centers Lists */}
          <CenterList centers={centers} />
        </section>

        {/* Advertisement */}
        <section className="w-[98%] lg:w-[95%] xl:w-4/5 mx-auto relative my-10">
          <Box
            sx={{
              backgroundImage: `url(${advertise.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: { xs: '370px', sm: '350px', md: '350px' },
              display: "flex",
              alignItems: 'center',
              justifyContent: 'center',
              gap: "20px",
              borderRadius: "3px",
              color: 'white',
              padding: { xs: '10px', sm: '20px' },
            }}
          >
            <Image className="hidden md:block w-[300px] md:mx-auto rounded" src={advertise2} width={400} height={400} alt="Advertise" />
            <Box className="lg:max-w-[60%]">
              <h3 className="text-2xl lg:text-4xl font-lora font-bold text-center md:text-left">
                Plan Your Dream Wed with WedPlan BD!
              </h3>
              <p className="font-lora font-semibold max-w-[90%] lg:max-w-[80%] mx-auto md:mx-0 text-center md:text-left mt-3 mb-8">
                Discover the best community centers, decorators, photographers & videographers, makeup artists, travels, attire & accessories and services all in one place.
                Let us help you create unforgettable memories on your special day!
              </p>
              <section className="w-max mx-auto md:mx-0">
                <Link className="text-black font-lora font-bold bg-white px-5 py-1.5 rounded border-2 border-black hover:bg-gray-100 " href="/centers">Let&apos;s Go</Link>
              </section>
            </Box>
          </Box>
        </section>

        {/* Reviews */}
        <section className="w-[98%] lg:w-[95%] xl:w-4/5 mx-auto my-16">
          <h3 className="md:text-lg xl:text-2xl font-lora font-semibold dark:text-white">Reviews</h3>

          {/* Slider */}
          <ReviewSlider reviews={reviews} />
        </section>

        <Footer />
      </main>
    </>
  );
}
