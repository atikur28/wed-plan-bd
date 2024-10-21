import NavbarTwo from "@/components/sharedUI/NavbarTwo";
import { Box } from "@mui/material";

const Dashboard = () => {
    return (
        <>
            <NavbarTwo />
            <Box className="mt-3">
                <h2 className="text-3xl text-center font-lora font-bold ">This is Dashboard Page</h2>
            </Box>
        </>
    );
};

export default Dashboard;