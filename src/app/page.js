import CategoryList from "@/components/ui/CategoryList";
import CustomSlider from "@/components/ui/CustomSlider";
import { Box, Typography } from "@mui/material";

const getCategories = async () => {
  const res = await fetch("http://localhost:3028/api/categories");
  const data = await res.json();
  return data.result;
}

export default async function Home() {
  const categories = await getCategories();

  return (
    <main className="mt-8">
      <CustomSlider />

      {/* Browse By Category */}
      <section className="w-[98%] lg:w-[95%] xl:w-4/5 mx-auto py-10">
        <Box className="flex justify-between items-center">
          <Typography className="md:text-lg xl:text-2xl font-lora font-semibold">Browse By Category</Typography>
          <Typography className="text-sm md:text-base font-lora font-semibold">View Al ({categories.length})</Typography>
        </Box>
        {/* Category Lists */}
        <CategoryList categories={categories} />
      </section>

      {/* Popular Centers */}
      <section className="w-[98%] lg:w-[95%] xl:w-4/5 mx-auto py-10">
        <Box className="flex justify-between items-center">
          <Typography className="md:text-lg xl:text-2xl font-lora font-semibold">Popular Venue</Typography>
          <Typography className="text-sm md:text-base font-lora font-semibold">View Al (1000)</Typography>
        </Box>
        {/* Centers Lists */}
      </section>
    </main>
  );
}
