import advertise2 from "@/assets/home/advertise-image-2.png";
import advertise from "@/assets/home/advertise-image.png";
import CategoryList from "@/components/ui/CategoryList";
import CenterList from "@/components/ui/CenterList";
import CustomSlider from "@/components/ui/CustomSlider";
import ReviewSlider from "@/components/ui/ReviewSlider";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

const getCategories = async () => {
  const res = await fetch("http://localhost:3005/api/categories");
  const data = await res.json();
  return data.result;
}

const popularCenters = async () => {
  const res = await fetch("http://localhost:3005/api/providers");
  const data = await res.json();

  const filteredData = data.result
    .filter((f) => f.status === "centers")
    .sort((a, b) => b.popularity - a.popularity);

  return filteredData;
}

const getReviews = async () => {
  const res = await fetch("http://localhost:3005/api/reviews");
  const data = await res.json();
  return data.result;
}

export default async function Home() {
  const categories = await getCategories();
  const centers = await popularCenters();
  const reviews = await getReviews();

  return (
    <main className="mt-8">
      <CustomSlider />

      {/* Browse By Category */}
      <section className="w-[98%] lg:w-[95%] xl:w-4/5 mx-auto my-10">
        <Box className="flex justify-between items-center">
          <Typography className="md:text-lg xl:text-2xl font-lora font-semibold dark:text-white">Browse By Category</Typography>
          <Typography className="text-sm md:text-base font-lora font-semibold dark:text-white">View All ({categories.length})</Typography>
        </Box>
        {/* Category Lists */}
        <CategoryList categories={categories} />
      </section>

      {/* Popular Centers */}
      <section className="w-[98%] lg:w-[95%] xl:w-4/5 mx-auto my-10">
        <Box className="flex justify-between items-center">
          <Typography className="md:text-lg xl:text-2xl font-lora font-semibold dark:text-white">Popular Centers</Typography>
          <Typography className="text-sm md:text-base font-lora font-semibold dark:text-white">View All ({centers.length})</Typography>
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
            height: { xs: '350px', sm: '300px', md: '350px' },
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
            <Typography variant="h4" className="font-lora font-bold text-center md:text-left" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
              Plan Your Dream Wed with WedPlan BD!
            </Typography>
            <Typography className="font-lora font-semibold max-w-[90%] lg:max-w-[80%] mx-auto md:mx-0 text-center md:text-left mt-3 mb-8" variant="body1" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
              Discover the best community centers, decorators, photographers & videographers, makeup artists, travels, attire & accessories and services all in one place.
              Let us help you create unforgettable memories on your special day!
            </Typography>
            <section className="w-max mx-auto md:mx-0">
              <Link className="text-black font-lora font-bold bg-white px-5 py-1.5 rounded border-2 border-black hover:bg-gray-100 " href="/centers">Let&apos;s Go</Link>
            </section>
          </Box>
        </Box>
      </section>

      {/* Reviews */}
      <section className="w-[98%] lg:w-[95%] xl:w-4/5 mx-auto my-16">
        <Typography className="md:text-lg xl:text-2xl font-lora font-semibold dark:text-white">Reviews</Typography>

        {/* Slider */}
        <ReviewSlider reviews={reviews} />
      </section>
    </main>
  );
}
