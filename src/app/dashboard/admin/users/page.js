import AdminUsersUI from "@/components/ui/AdminUsersUI";
import { Box } from "@mui/material";

const AdminUsers = () => {
    return (
        <Box className="mx-2 md:mx-3 lg:mx-0 lg:mr-4">
            <AdminUsersUI />
        </Box>
    );
};

export default AdminUsers;

export function generateMetadata() {
    return {
        title: "User Management - Dashboard",
        description: "Manage users effectively with our comprehensive dashboard, allowing you to add, edit, delete, and view user details with ease.",
        keywords: "User Management, Dashboard, Admin, Users, Management System",
        author: "WedPlan BD",
        viewport: "width=device-width, initial-scale=1.0",
    };
}
