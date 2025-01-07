import mongoose from "mongoose";

const URI = process.env.MONGODB_URI

const connectDB = async() => {
    try {
        await mongoose.connect(URI)
    } catch (error) {
        console.error("Database connection failed!!")
        process.exit(0)
    }
}

export default connectDB;