import mongoose, { models, model } from "mongoose";

const GeneralSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default models.General || model("General", GeneralSchema);