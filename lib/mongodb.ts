import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;


let isConnected = false;

export async function connectDB() {
    if (isConnected) {
        return;
    }
    
    if (!MONGODB_URI) {
      throw new Error("❌ Missing MONGODB_URI in .env");
    }
  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = true;

    console.log("📌 MongoDB connected using Mongoose");
  } catch (error) {
    console.error("❌ Mongoose connection error:", error);
    throw error;
  }
}
