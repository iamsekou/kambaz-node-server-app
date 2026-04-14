import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

// the dao (data access object) is where all the database calls live.
// keeping this separate from routes makes it clean and easy to test.
export default function QuizzesDao() {
  // get every quiz that belongs to a specific course
  const findQuizzesForCourse = (courseId) =>
    model.find({ course: courseId });

  // get a single quiz by its id
  const findQuizById = (quizId) => model.findById(quizId);

  // create a brand new quiz and attach it to a course.
  // we generate a uuid here so we don't rely on mongo's default objectid format
  const createQuiz = (quiz) => {
    const newQuiz = { ...quiz, _id: uuidv4() };
    return model.create(newQuiz);
  };

  // remove a quiz by id. this doesn't cascade delete questions,
  // so we handle that separately in the routes if needed
  const deleteQuiz = (quizId) => model.deleteOne({ _id: quizId });

  // update any fields on a quiz. $set only touches the fields passed in,
  // leaving everything else unchanged
  const updateQuiz = (quizId, quizUpdates) =>
    model.updateOne({ _id: quizId }, { $set: quizUpdates });

  // toggle published status on or off for a quiz
  const publishQuiz = (quizId, published) =>
    model.updateOne({ _id: quizId }, { $set: { published } });

  return {
    findQuizzesForCourse,
    findQuizById,
    createQuiz,
    deleteQuiz,
    updateQuiz,
    publishQuiz,
  };
}
