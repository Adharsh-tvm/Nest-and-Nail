import mongoose from "mongoose";

export async function connectDB(uri: string) {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("Database connection failed", err);
        process.exit(1);
    }
}
