import AttemptsDao from "./dao.js";
import QuizzesDao from "../quizzes/dao.js";
import QuestionsDao from "../questions/dao.js";

export default function AttemptsRoutes(app) {
  const attemptsDao = AttemptsDao();
  const quizzesDao = QuizzesDao();
  const questionsDao = QuestionsDao();

  // helper: make sure somebody is actually logged in
  const requireLogin = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return null;
    }
    return currentUser;
  };

  // faculty: returns all attempts by all students for a quiz
  // students: returns only their own attempts
  const getAttempts = async (req, res) => {
    const currentUser = requireLogin(req, res);
    if (!currentUser) return;

    const { quizId } = req.params;

    if (currentUser.role === "FACULTY") {
      // faculty can see everyone's attempts
      const all = await attemptsDao.findAllAttemptsForQuiz(quizId);
      return res.json(all);
    }

    // students only see their own attempts
    const mine = await attemptsDao.findAttemptsForStudentOnQuiz(
      quizId,
      currentUser._id
    );
    res.json(mine);
  };

  // returns the most recent attempt by the current student on this quiz.
  // the front end uses this to show the student their last score and answers.
  const getLastAttempt = async (req, res) => {
    const currentUser = requireLogin(req, res);
    if (!currentUser) return;

    const { quizId } = req.params;
    const last = await attemptsDao.findLastAttempt(quizId, currentUser._id);

    // if they haven't taken it yet, just return null instead of an error
    res.json(last || null);
  };

  // POST /api/quizzes/:quizId/attempts
  // this is the main route for submitting a quiz.
  // it validates the attempt limit, grades the answers, and saves everything.
  const submitAttempt = async (req, res) => {
    const currentUser = requireLogin(req, res);
    if (!currentUser) return;

    const { quizId } = req.params;

    // load the quiz so we can check attempt settings
    const quiz = await quizzesDao.findQuizById(quizId);
    if (!quiz) return res.sendStatus(404);

    // students can't submit to unpublished quizzes
    if (currentUser.role === "STUDENT" && !quiz.published) {
      return res.status(403).json({ message: "this quiz is not available yet" });
    }

    // check how many times this student has already submitted
    const attemptCount = await attemptsDao.countAttemptsForStudentOnQuiz(
      quizId,
      currentUser._id
    );

    // figure out the max allowed attempts.
    // if multipleAttempts is false, they only get 1 shot no matter what.
    const maxAttempts = quiz.multipleAttempts ? quiz.howManyAttempts : 1;

    // if they've already used up all their attempts, block the submission
    if (attemptCount >= maxAttempts) {
      return res.status(403).json({
        message: `you have used all ${maxAttempts} allowed attempt(s) for this quiz`,
      });
    }

    // load all the actual questions with the correct answers (full data, not sanitized)
    const questions = await questionsDao.findQuestionsForQuiz(quizId);

    // the student's answers come in from the request body as an array of
    // { questionId, answer } objects
    const { answers } = req.body;

    // grade each answer by comparing it to the correct answer stored on the question
    let score = 0;

    const gradedAnswers = (answers || []).map((submitted) => {
      const question = questions.find(
        (q) => q._id === submitted.questionId
      );

      if (!question) return { ...submitted, correct: false, pointsEarned: 0 };

      let correct = false;

      if (question.type === "MULTIPLE_CHOICE") {
        // find which choice is marked as correct, then compare text
        const correctChoice = question.choices.find((c) => c.isCorrect);
        correct =
          correctChoice &&
          submitted.answer?.trim().toLowerCase() ===
            correctChoice.text?.trim().toLowerCase();
      } else if (question.type === "TRUE_FALSE") {
        // stored as "true" or "false" string
        correct =
          submitted.answer?.trim().toLowerCase() ===
          question.correctAnswer?.trim().toLowerCase();
      } else if (question.type === "FILL_IN_BLANK") {
        // fill-in-the-blank accepts any of the listed correct answers,
        // and it's case insensitive so "Paris" and "paris" both count
        const studentAnswer = submitted.answer?.trim().toLowerCase();
        correct = (question.correctAnswers || []).some(
          (ca) => ca.trim().toLowerCase() === studentAnswer
        );
      }

      const pointsEarned = correct ? question.points : 0;
      score += pointsEarned;

      return {
        questionId: submitted.questionId,
        answer: submitted.answer,
        correct,
        pointsEarned,
      };
    });

    // build the attempt document with the next attempt number
    const newAttempt = {
      quiz: quizId,
      student: currentUser._id,
      answers: gradedAnswers,
      score,
      attemptNumber: attemptCount + 1,
      submittedAt: new Date(),
    };

    const saved = await attemptsDao.createAttempt(newAttempt);

    // send back the saved attempt including the score and which answers were right
    res.json(saved);
  };

  // register all attempt routes
  app.get("/api/quizzes/:quizId/attempts", getAttempts);
  app.get("/api/quizzes/:quizId/attempts/last", getLastAttempt);
  app.post("/api/quizzes/:quizId/attempts", submitAttempt);
}
