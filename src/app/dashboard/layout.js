import DashboardDrawer from "@/components/sharedUI/DashboardDrawer";
import DashboardMenus from "@/components/sharedUI/DashboardMenus";
import Footer from "@/components/sharedUI/Footer";
import { Box } from "@mui/material";

export const metadata = {
    title: "Dashboard - WedPlan BD",
    description: "Manage your account, services, and more through the dashboard."
};

export default function DashboardLayout({ children }) {

    return (
        <>
            <DashboardDrawer />
            <Box className="lg:flex lg:justify-center lg:gap-[2%] min-h-[70vh]">
                {/* First Column */}
                <Box className="hidden lg:block lg:w-[30%] xl:w-[20%] 3xl:w-[600px] bg-[#f5f5f5] border-r-2 border-b-2">
                    <DashboardMenus />
                </Box>
                {/* Second Column */}
                <Box className="lg:w-[68%] xl:w-[78%] 3xl:w-full">
                    {children}
                </Box>
            </Box>
            <Footer />
        </>
    )
}