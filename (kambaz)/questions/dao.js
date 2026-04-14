import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function QuestionsDao() {
  // get all questions for a quiz, in the order they were created
  const findQuestionsForQuiz = (quizId) =>
    model.find({ quiz: quizId });

  // get a single question by its id
  const findQuestionById = (questionId) => model.findById(questionId);

  // create a new question and link it to the quiz
  const createQuestion = (question) => {
    const newQuestion = { ...question, _id: uuidv4() };
    return model.create(newQuestion);
  };

  // remove a question from the database
  const deleteQuestion = (questionId) =>
    model.deleteOne({ _id: questionId });

  // update the fields of an existing question
  const updateQuestion = (questionId, questionUpdates) =>
    model.updateOne({ _id: questionId }, { $set: questionUpdates });

  // delete all questions for a quiz at once.
  // useful when a quiz itself gets deleted so we don't leave orphaned questions
  const deleteQuestionsForQuiz = (quizId) =>
    model.deleteMany({ quiz: quizId });

  return {
    findQuestionsForQuiz,
    findQuestionById,
    createQuestion,
    deleteQuestion,
    updateQuestion,
    deleteQuestionsForQuiz,
  };
}
