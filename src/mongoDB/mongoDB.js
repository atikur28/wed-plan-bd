import mongoose from "mongoose";

export async function mongoDbConnect() {
    try {
        await mongoose.connect(process.env.mongodb_uri);
        const connected = mongoose.connection;

        connected.on("connected", () => {
            console.log("Connected to mongoDB");
        });

        connected.on("error", (error) => {
            console.log("MongoDB connection error!" + error);
            process.exit();
        });

    } catch (error) {
        console.log("Something went wrong in connecting to mongoDB");
        console.log(error);
    }
}