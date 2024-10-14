import ProfileInfo from "@/components/ui/ProfileInfo";
import { Box } from "@mui/material";

const IMAGE_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${process.env.cloud_name}/image/upload`;
const IMAGE_UPLOAD_PRESET = process.env.image_preset;
const IMAGE_UPLOAD_FOLDER = process.env.image_folder;

const Profile = () => {
    const uploadData = { IMAGE_UPLOAD_URL, IMAGE_UPLOAD_PRESET, IMAGE_UPLOAD_FOLDER }

    return (
        <Box className="mt-8">
            <ProfileInfo uploadData={uploadData} />
        </Box>
    );
};

export default Profile;
