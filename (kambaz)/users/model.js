import mongoose from "mongoose";       // Load mongoose library
import schema from "./schema.js";       // Load users schema

const model = mongoose.model("UserModel", schema); // create mongoose model from the schema
export default model;                              // export so it can be used elsewhere
