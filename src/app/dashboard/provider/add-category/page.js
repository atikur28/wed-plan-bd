import AddCategoryUI from '@/components/ui/AddCategoryUI';
import { Box } from '@mui/material';

const IMAGE_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${process.env.cloud_name}/image/upload`;
const IMAGE_UPLOAD_PRESET = process.env.image_preset;
const IMAGE_UPLOAD_FOLDER = process.env.image_folder;

const AddCategory = () => {
    const uploadData = { IMAGE_UPLOAD_URL, IMAGE_UPLOAD_PRESET, IMAGE_UPLOAD_FOLDER };

    console.log(uploadData);
    
    return (
        <Box className="mx-3 lg:mx-0 lg:mr-5 mb-10">
            <AddCategoryUI uploadData={uploadData} />
        </Box>
    );
};

export default AddCategory;

export function generateMetadata() {
    return {
        title: "Add Category - Dashboard",
        description: "Add new categories to the WedPlan BD dashboard, including entertainers, attire, photographers, community centers, and more."
    }
}