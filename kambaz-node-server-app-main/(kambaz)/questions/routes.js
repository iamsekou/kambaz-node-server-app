import QuestionsDao from "./dao.js";
import QuizzesDao from "../quizzes/dao.js";

export default function QuestionsRoutes(app) {
  const dao = QuestionsDao();
  const quizzesDao = QuizzesDao();

  // helper that checks only faculty members can create/edit/delete questions
  const requireFaculty = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return null;
    }
    if (currentUser.role !== "FACULTY") {
      res.sendStatus(403);
      return null;
    }
    return currentUser;
  };

  const requireLogin = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return null;
    }
    return currentUser;
  };

  // GET /api/quizzes/:quizId/questions
  // returns all the questions for a quiz.
  // both faculty and students can fetch questions (students need them to take the quiz)
  // but we strip out the correct answer fields for students so they can't cheat
  const findQuestionsForQuiz = async (req, res) => {
    const currentUser = requireLogin(req, res);
    if (!currentUser) return;

    const { quizId } = req.params;
    const questions = await dao.findQuestionsForQuiz(quizId);

    // if a student is requesting questions, remove the correct answer data
    // so they can only see the question text and choices instead of what's right
    if (currentUser.role === "STUDENT") {
      const sanitized = questions.map((q) => {
        const safe = q.toObject();
        delete safe.correctAnswer;
        delete safe.correctAnswers;
        // for multiple choice, hide which choice is marked as correct
        if (safe.choices) {
          safe.choices = safe.choices.map(({ text }) => ({ text }));
        }
        return safe;
      });
      return res.json(sanitized);
    }

    res.json(questions);
  };

  // GET /api/questions/:questionId
  // get one question by id. faculty only since this exposes correct answer
  const findQuestionById = async (req, res) => {
    if (!requireFaculty(req, res)) return;

    const { questionId } = req.params;
    const question = await dao.findQuestionById(questionId);
    if (!question) return res.sendStatus(404);
    res.json(question);
  };

  // create a new question under a quiz.
  // after creating, we also recalculate the quiz's total points so it stays accurate.
  const createQuestionForQuiz = async (req, res) => {
    if (!requireFaculty(req, res)) return;

    const { quizId } = req.params;
    const question = { ...req.body, quiz: quizId };
    const newQuestion = await dao.createQuestion(question);

    // recalculate total quiz points by summing all question points
    await recalcQuizPoints(quizId);

    res.json(newQuestion);
  };

  // remove a question. we also update the quiz total points after deletion.
  const deleteQuestion = async (req, res) => {
    if (!requireFaculty(req, res)) return;

    const { questionId } = req.params;
    const question = await dao.findQuestionById(questionId);

    if (!question) return res.sendStatus(404);
    const quizId = question.quiz;

    await dao.deleteQuestion(questionId);

    // recalculate quiz points now that this question is gone
    await recalcQuizPoints(quizId);

    res.json({ success: true });
  };

  // update a question's content or point value.
  //  we recalculate quiz total points in case the point value changed.
  const updateQuestion = async (req, res) => {
    if (!requireFaculty(req, res)) return;

    const { questionId } = req.params;
    const questionUpdates = req.body;

    const existing = await dao.findQuestionById(questionId);
    if (!existing) return res.sendStatus(404);

    await dao.updateQuestion(questionId, questionUpdates);

    // recalculate quiz points bc the question point value may have changed
    await recalcQuizPoints(existing.quiz);

    res.json({ success: true });
  };

  // helper that adds up the points of all questions in a quiz and updates the quiz record.
  // this keeps the quiz's "points" field always in sync with its questions.
  const recalcQuizPoints = async (quizId) => {
    const questions = await dao.findQuestionsForQuiz(quizId);
    const total = questions.reduce((sum, q) => sum + (q.points || 0), 0);
    await quizzesDao.updateQuiz(quizId, { points: total });
  };

  // register all question routes
  app.get("/api/quizzes/:quizId/questions", findQuestionsForQuiz);
  app.get("/api/questions/:questionId", findQuestionById);
  app.post("/api/quizzes/:quizId/questions", createQuestionForQuiz);
  app.delete("/api/questions/:questionId", deleteQuestion);
  app.put("/api/questions/:questionId", updateQuestion);
}
