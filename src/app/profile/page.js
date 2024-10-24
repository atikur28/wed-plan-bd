import Footer from "@/components/sharedUI/Footer";
import Navbar from "@/components/sharedUI/Navbar";
import ProfileInfo from "@/components/ui/ProfileInfo";
import { Box } from "@mui/material";

const IMAGE_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${process.env.cloud_name}/image/upload`;
const IMAGE_UPLOAD_PRESET = process.env.image_preset;
const IMAGE_UPLOAD_FOLDER = process.env.image_folder;

const Profile = () => {
    const uploadData = { IMAGE_UPLOAD_URL, IMAGE_UPLOAD_PRESET, IMAGE_UPLOAD_FOLDER }

    return (
        <>
            <Navbar />
            <Box className="mt-8 min-h-[70vh]">
                <ProfileInfo uploadData={uploadData} />
            </Box>
            <Footer />
        </>
    );
};

export default Profile;

export function generateMetadata() {
    return {
        title: "Profile - WedPlan BD",
        description: "Manage your personal information, view your wedding planning progress, and update your preferences on your WedPlan BD profile."
    }
}