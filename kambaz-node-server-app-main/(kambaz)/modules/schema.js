import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    description: String,
    module: String,
  },
  { _id: false }
);

// NOTE: do NOT put { _id: false } here.
// With { _id: false }, Mongoose disables its internal DocumentArray _id tracking,
// which breaks DocumentArray.prototype.id() used by updateModule.
// The explicit `_id: String` declaration below is enough to store string IDs
// without Mongoose auto-generating ObjectIds.
const moduleSchema = new mongoose.Schema({
  _id: String,
  name: String,
  description: String,
  course: String,
  lessons: [lessonSchema],
});

export default moduleSchema;
