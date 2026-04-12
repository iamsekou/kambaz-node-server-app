import mongoose from "mongoose";
import courseSchema from "./schema.js";

const model = mongoose.model("CourseModel", courseSchema);
export default model;
