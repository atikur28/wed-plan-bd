import AddPostForm from "@/components/ui/AddPostForm";
import { Box } from "@mui/material";

const IMAGE_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${process.env.cloud_name}/image/upload`;
const IMAGE_UPLOAD_PRESET = process.env.image_preset;
const IMAGE_UPLOAD_FOLDER = process.env.image_folder;

const AddPost = () => {
    const uploadData = { IMAGE_UPLOAD_URL, IMAGE_UPLOAD_PRESET, IMAGE_UPLOAD_FOLDER };

    return (
        <Box className="mx-3 lg:mx-0 lg:mr-5 mb-10">
            <AddPostForm uploadData={uploadData} />
        </Box>
    );
};

export default AddPost;

export function generateMetadata() {
    return {
        title: "Add Post - Dashboard",
        description: "Create a new service post for the WedPlan BD platform. Fill in details such as service name, provider information, pricing, location, and more to help users find your service."
    }
}