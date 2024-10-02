import mongoose from "mongoose";

const reviewModel = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide reviewer's name"]
    },
    image: String,
    email: {
        type: String,
        required: [true, "Please provide reviewer's email"]
    },
    review: {
        type: String,
        required: [true, "Please provide reviewer's review"]
    },
    recommendation: String
});

const Review = mongoose.models.reviews || mongoose.model("reviews", reviewModel);

export default Review;