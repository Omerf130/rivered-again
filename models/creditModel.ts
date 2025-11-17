import mongoose, { models, model } from "mongoose";

const CreditSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default models.Credit || model("Credit", CreditSchema);