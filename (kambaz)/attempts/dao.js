import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function AttemptsDao() {
  // get all attempts a specific student has made on a specific quiz.
  // sorted oldest to newest so we can easily grab the latest one.
  const findAttemptsForStudentOnQuiz = (quizId, studentId) =>
    model
      .find({ quiz: quizId, student: studentId })
      .sort({ attemptNumber: 1 });

  // count how many times a student has attempted a quiz
  // we use this to enforce the attempt limit before allowing a new submission
  const countAttemptsForStudentOnQuiz = (quizId, studentId) =>
    model.countDocuments({ quiz: quizId, student: studentId });

  // get just the most recent attempt by a student on a quiz.
  // sorting by attemptNumber descending and taking the first result does the trick.
  const findLastAttempt = (quizId, studentId) =>
    model
      .findOne({ quiz: quizId, student: studentId })
      .sort({ attemptNumber: -1 });

  // save a new attempt to the database.
  // the score and attemptNumber are calculated before calling this.
  const createAttempt = (attempt) => {
    const newAttempt = { ...attempt, _id: uuidv4() };
    return model.create(newAttempt);
  };

  // get all attempts for a quiz, across all students.
  // useful if a faculty member wants to see overall submission stats.
  const findAllAttemptsForQuiz = (quizId) =>
    model.find({ quiz: quizId }).sort({ submittedAt: -1 });

  return {
    findAttemptsForStudentOnQuiz,
    countAttemptsForStudentOnQuiz,
    findLastAttempt,
    createAttempt,
    findAllAttemptsForQuiz,
  };
}
