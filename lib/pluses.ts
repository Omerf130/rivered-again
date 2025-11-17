import { connectDB } from "./mongodb";
import Plus from "../models/plusModel";

export async function getPluses() {
  await connectDB();
  return Plus.find().sort({ createdAt: -1 });
}

export async function addPlus(data: { name: string; amount: number }) {
  await connectDB();
  return Plus.create(data);
}

export async function deletePlus(id: string) {
  await connectDB();
  return Plus.findByIdAndDelete(id);
}

export async function updatePlus(id: string, data: any) {
  await connectDB();
  return Plus.findByIdAndUpdate(id, data, { new: true });
}