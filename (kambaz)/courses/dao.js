import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function CoursesDao(db) {
  const findAllCourses = () =>
    model.find({}, { name: 1, description: 1, number: 1, startDate: 1, endDate: 1, department: 1, credits: 1 });

  const findCourseById = (courseId) => model.findById(courseId);

  const findCoursesForEnrolledUser = async (userId) => {
    const { enrollments } = db;
    const enrolledCourseIds = enrollments
      .filter((e) => e.user === userId)
      .map((e) => e.course);
    return model.find(
      { _id: { $in: enrolledCourseIds } },
      { name: 1, description: 1, number: 1, startDate: 1, endDate: 1, department: 1, credits: 1 }
    );
  };

  const createCourse = (course) => {
    const newCourse = { ...course, _id: uuidv4() };
    return model.create(newCourse);
  };

  const deleteCourse = (courseId) => model.deleteOne({ _id: courseId });

  const updateCourse = (courseId, courseUpdates) =>
    model.updateOne({ _id: courseId }, { $set: courseUpdates });

  return {
    findAllCourses,
    findCourseById,
    findCoursesForEnrolledUser,
    createCourse,
    deleteCourse,
    updateCourse,
  };
}
