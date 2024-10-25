import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your first name"]
    },
    image: String,
    email: {
        type: String,
        required: [true, "Please provide an email"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"]
    },
    age: String,
    address: String,
    bio: String,
    additionalInfo: Array,
    userCategory: String,
    status: String,
    signedUp : Date,
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyToken: String,
    verifyTokenExpiry: Date,
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date
});

const User = mongoose.models.users || mongoose.model("users", userModel);

export default User;