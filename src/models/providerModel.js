import mongoose from "mongoose";

const providerModel = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"]
    },
    professionImage: String,
    email: {
        type: String,
        required: [true, "Please provide an email"]
    },
    address: String,
    status: String,
    rating: Number,
    popularity: Number
});

const Provider = mongoose.models.providers || mongoose.model("providers", providerModel);

export default Provider;