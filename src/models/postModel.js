import mongoose from "mongoose";

const postModel = new mongoose.Schema({
    serviceName: {
        type: String,
        required: [true, "Please provide a service name"]
    },
    provider: {
        type: String,
        required: [true, "Please provide provider's name"]
    },
    serviceImage: {
        type: String,
        required: [true, "Please provide a service's image"]
    },
    email: {
        type: String,
        required: [true, "Please provide provider's email"]
    },
    status: {
        type: String,
        required: [true, "Please provide post's status"]
    },
    professionName: {
        type: String,
        required: [true, "Please provide post's profession name"]
    },
    number: {
        type: Number,
        required: [true, "Please provide provider's number"]
    },
    price: Number,
    location: {
        type: String,
        required: [true, "Please provide service's location"]
    },
    availableDays: String,
    description: {
        type: String,
        required: [true, "Please provide service's description"]
    },
    liked: Array,
    ratings: {
        average: {
            type: Number,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        },
        userRatings: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            ratingValue: {
                type: Number,
                min: 1,
                max: 5,
                required: true
            }
        }]
    },
    review: Array,
    date: Date,
});

const Post = mongoose.models.posts || mongoose.model("posts", postModel);

export default Post;