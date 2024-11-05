import AdminEventsUI from "@/components/ui/AdminEventsUI";
import { Box } from "@mui/material";



const Events = async () => {
    return (
        <Box className="mx-2 md:mx-3 lg:mx-0 lg:mr-4">
            <AdminEventsUI/>
        </Box>
    );
};

export default Events;

export function generateMetadata() {
    return {
        title: "Wedding Event Management - Dashboard",
        description: "Manage all your wedding event needs in one place with WedPlan BD. Discover services for photographers, decorators, caterers, and more!"
    }
}