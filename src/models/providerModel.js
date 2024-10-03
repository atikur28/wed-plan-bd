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
    cost: String,
    address: String,
    status: String,
    professionName: String,
    additionalInfo: Array,
    popularity: Array
});

const Provider = mongoose.models.providers || mongoose.model("providers", providerModel);

export default Provider;