import mongoose from "mongoose";
import moduleSchema from "../modules/schema.js";

const courseSchema = new mongoose.Schema(
  {
    _id: String,
    name: { type: String, required: true },
    number: String,
    startDate: String,
    endDate: String,
    department: String,
    credits: Number,
    description: String,
    modules: [moduleSchema],
  },
  { collection: "courses" }
);

export default courseSchema;
