import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please provide your first name"]
    },
    lastName: String,
    email: {
        type: String,
        required: [true, "Please provide an email"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"]
    },
    status: String,
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