import mongoose from "mongoose";
import schema from "./schema.js";

// register the schema with mongoose as "QuestionModel"
const model = mongoose.model("QuestionModel", schema);
export default model;
