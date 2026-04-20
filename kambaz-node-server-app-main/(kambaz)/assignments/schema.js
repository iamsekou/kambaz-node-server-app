import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    course: { type: String, ref: "CourseModel" },
    description: String,
    points: Number,
    dueDate: String,
    availableFromDate: String,
    availableUntilDate: String,
    assignmentGroup: {
      type: String,
      enum: ["ASSIGNMENTS", "QUIZZES", "EXAMS", "PROJECT"],
      default: "ASSIGNMENTS",
    },
    submissionType: {
      type: String,
      enum: ["ONLINE", "ON_PAPER", "EXTERNAL_TOOL"],
      default: "ONLINE",
    },
  },
  { collection: "assignments" }
);

export default assignmentSchema;
