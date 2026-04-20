import mongoose from "mongoose";
import schema from "./schema.js";

// register the schema with mongoose as "QuizModel" so we can use it in dao.js
const model = mongoose.model("QuizModel", schema);
export default model;
