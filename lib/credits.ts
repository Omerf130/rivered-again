import { connectDB } from "./mongodb";
import Credit from "../models/creditModel";

export async function getCredits() {
  await connectDB();
  return Credit.find().sort({ createdAt: -1 });
}

export async function addCredit(data: { name: string; amount: number }) {
  await connectDB();
  return Credit.create(data);
}

export async function deleteCredit(id: string) {
  await connectDB();
  return Credit.findByIdAndDelete(id);
}

export async function updateCredit(id: string, data: any) {
  await connectDB();
  return Credit.findByIdAndUpdate(id, data, { new: true });
}