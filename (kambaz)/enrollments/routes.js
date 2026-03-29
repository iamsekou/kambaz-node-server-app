import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  const findMyEnrollments = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) { res.sendStatus(401); return; }
    const enrollments = dao.findEnrollmentsForUser(currentUser._id);
    res.json(enrollments);
  };

  const findEnrollmentsForCourse = (req, res) => {
    const { courseId } = req.params;
    const enrollments = dao.findEnrollmentsForCourse(courseId);
    res.json(enrollments);
  };

  const enrollCurrentUserInCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) { res.sendStatus(401); return; }
    const { courseId } = req.params;
    const enrollment = dao.enrollUserInCourse(currentUser._id, courseId);
    res.json(enrollment);
  };

  const unenrollCurrentUserFromCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) { res.sendStatus(401); return; }
    const { courseId } = req.params;
    const status = dao.unenrollUserFromCourse(currentUser._id, courseId);
    res.send(status);
  };

  app.get("/api/users/current/enrollments", findMyEnrollments);
  app.get("/api/courses/:courseId/enrollments", findEnrollmentsForCourse);
  app.post("/api/courses/:courseId/enroll", enrollCurrentUserInCourse);
  app.delete("/api/courses/:courseId/enroll", unenrollCurrentUserFromCourse);
}