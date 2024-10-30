import AdminDashboardUI from "@/components/ui/AdminDashboardUI";
import { Box } from "@mui/material";

const AdminDashboard = () => {

    return (
        <Box className="mx-3 lg:mx-0 lg:mr-5 mb-10">
            <AdminDashboardUI />
        </Box>
    );
};

export default AdminDashboard;

export function generateMetadata() {
    return {
        title: "Admin Dashboard",
        description: "Manage and oversee all services, posts, and user activities on the WedPlan BD platform. Add new services, monitor engagements, and maintain platform quality from a centralized dashboard."
    };
}