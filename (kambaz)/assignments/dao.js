import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function AssignmentsDao(db) {
  const findAssignmentsForCourse = (courseId) =>
    model.find({ course: courseId });

  const findAssignmentById = (assignmentId) => model.findById(assignmentId);

  const createAssignment = (assignment) => {
    const newAssignment = { ...assignment, _id: uuidv4() };
    return model.create(newAssignment);
  };

  const deleteAssignment = (assignmentId) =>
    model.deleteOne({ _id: assignmentId });

  const updateAssignment = (assignmentId, assignmentUpdates) =>
    model.updateOne({ _id: assignmentId }, { $set: assignmentUpdates });

  return {
    findAssignmentsForCourse,
    findAssignmentById,
    createAssignment,
    deleteAssignment,
    updateAssignment,
  };
}
