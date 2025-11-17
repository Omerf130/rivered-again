import mongoose, { models, model } from "mongoose";

const PlusSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default models.Plus || model("Plus", PlusSchema);