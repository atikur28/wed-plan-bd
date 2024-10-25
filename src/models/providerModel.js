import mongoose from "mongoose";

const providerModel = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"]
    },
    posts: Array,
    email: {
        type: String,
        required: [true, "Please provide an email"]
    },
    status: String,
    professionName: String,
    photos: Array,
    videos: Array,
    popularity: Array
});

const Provider = mongoose.models.providers || mongoose.model("providers", providerModel);

export default Provider;