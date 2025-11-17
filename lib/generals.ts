import { connectDB } from "./mongodb";
import General from "../models/generalModel";

export async function getGenerals() {
  await connectDB();
  return General.find().sort({ createdAt: -1 });
}

export async function addGeneral(data: { title: string; amount: number }) {
  await connectDB();
  return General.create(data);
}

export async function deleteGeneral(id: string) {
  await connectDB();
  return General.findByIdAndDelete(id);
}

export async function updateGeneral(id: string, data: any) {
  await connectDB();
  return General.findByIdAndUpdate(id, data, { new: true });
}