
import { connectDB } from "./mongodb";
import Transaction from "../models/transactionModel";

export async function getTransactions() {
  await connectDB();
  return Transaction.find().sort({ createdAt: -1 });
}

export async function addTransaction(data: { transaction: string; amount: number }) {
  await connectDB();
  return Transaction.create(data);
}

export async function deleteTransaction(id: string) {
  await connectDB();
  return Transaction.findByIdAndDelete(id);
}

export async function updateTransaction(id: string, data: any) {
  await connectDB();
  return Transaction.findByIdAndUpdate(id, data, { new: true });
}
