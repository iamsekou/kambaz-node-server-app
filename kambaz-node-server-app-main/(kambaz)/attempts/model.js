import mongoose from "mongoose";
import schema from "./schema.js";

// register the schema with mongoose as "AttemptModel"
const model = mongoose.model("AttemptModel", schema);
export default model;
