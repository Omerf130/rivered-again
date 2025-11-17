import mongoose, { models, model } from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    transaction: { type: String, required: true },
    amount: { type: Number, required: true  },
  },
  { timestamps: true }
);

export default models.Transaction || model("Transaction", TransactionSchema);
