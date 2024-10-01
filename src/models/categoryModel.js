import mongoose from "mongoose";

const categoryModel = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide category's name"]
    },
    image: {
        type: String,
        required: [true, "Please provide category's image"]
    },
    pathName: {
        type: String,
        required: [true, "Please provide category's path name"]
    }
});

const Category = mongoose.models.categories || mongoose.model("categories", categoryModel);

export default Category;