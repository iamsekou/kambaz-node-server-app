import QuizzesDao from "./dao.js";

export default function QuizzesRoutes(app) {
  const dao = QuizzesDao();

  // helper function to check if someone is logged in and is a faculty member.
  // if not, it sends the right error code and returns null
  const requireFaculty = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401); // not logged in
      return null;
    }
    if (currentUser.role !== "FACULTY") {
      res.sendStatus(403); // logged in but not allowed
      return null;
    }
    return currentUser;
  };

  // helper to checks if someone is logged in at all 
  // (students and faculty both pass)
  const requireLogin = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return null;
    }
    return currentUser;
  };

  // GET /api/courses/:courseId/quizzes
  // returns all quizzes for a course.
  // students only see published quizzes; faculty see all of them
  const findQuizzesForCourse = async (req, res) => {
    const currentUser = requireLogin(req, res);
    if (!currentUser) return;

    const { courseId } = req.params;
    const quizzes = await dao.findQuizzesForCourse(courseId);

    // if a student is asking, filter out unpublished quizzes so they can't see drafts
    if (currentUser.role === "STUDENT") {
      return res.json(quizzes.filter((q) => q.published));
    }

    res.json(quizzes);
  };

  // GET /api/quizzes/:quizId
  // returns the details of one specific quiz
  const findQuizById = async (req, res) => {
    const currentUser = requireLogin(req, res);
    if (!currentUser) return;

    const { quizId } = req.params;
    const quiz = await dao.findQuizById(quizId);

    if (!quiz) return res.sendStatus(404);

    // students shouldn't be able to fetch an unpublished quiz directly
    if (currentUser.role === "STUDENT" && !quiz.published) {
      return res.sendStatus(403);
    }

    res.json(quiz);
  };

  // POST /api/courses/:courseId/quizzes
  // creates a new quiz under a course. faculty only.
  const createQuizForCourse = async (req, res) => {
    if (!requireFaculty(req, res)) return;

    const { courseId } = req.params;
    // attach the course id from the url into the quiz object
    const quiz = { ...req.body, course: courseId };
    const newQuiz = await dao.createQuiz(quiz);
    res.json(newQuiz);
  };

  // DELETE /api/quizzes/:quizId
  // deletes a quiz. faculty only.
  const deleteQuiz = async (req, res) => {
    if (!requireFaculty(req, res)) return;

    const { quizId } = req.params;
    const status = await dao.deleteQuiz(quizId);
    res.json(status);
  };

  // PUT /api/quizzes/:quizId
  // updates a quiz's fields. faculty only.
  const updateQuiz = async (req, res) => {
    if (!requireFaculty(req, res)) return;

    const { quizId } = req.params;
    const quizUpdates = req.body;
    const status = await dao.updateQuiz(quizId, quizUpdates);
    res.json(status);
  };

  // PUT /api/quizzes/:quizId/publish
  // toggles a quiz between published and unpublished. faculty only.
  // expects body: { published: true } or { published: false }
  const publishQuiz = async (req, res) => {
    if (!requireFaculty(req, res)) return;

    const { quizId } = req.params;
    const { published } = req.body;
    const status = await dao.publishQuiz(quizId, published);
    res.json(status);
  };

  // register all the quiz routes with express
  app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);
  app.get("/api/quizzes/:quizId", findQuizById);
  app.post("/api/courses/:courseId/quizzes", createQuizForCourse);
  app.delete("/api/quizzes/:quizId", deleteQuiz);
  app.put("/api/quizzes/:quizId", updateQuiz);
  app.put("/api/quizzes/:quizId/publish", publishQuiz);
}
