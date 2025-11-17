import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();

    // Ping MongoDB
    const admin = mongoose.connection.getClient().db().admin();
    const ping = await admin.ping();

    return Response.json({
      ok: true,
      message: "MongoDB connected successfully",
      ping,
    });
  } catch (error: any) {
    return Response.json(
      { ok: false, message: "MongoDB connection failed", error: error.message },
      { status: 500 }
    );
  }
}
