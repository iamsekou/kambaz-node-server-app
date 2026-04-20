import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  // Returns the enrolled courses (as course objects) for the current user.
  // Used by the dashboard to populate the `enrollments` state for isEnrolled checks.
  const findMyEnrollments = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const courses = await dao.findCoursesForUser(currentUser._id);
    res.json(courses);
  };

  // Returns the users enrolled in a given course.
  const findEnrollmentsForCourse = async (req, res) => {
    const { courseId } = req.params;
    const users = await dao.findUsersForCourse(courseId);
    res.json(users);
  };

  // Kept for backwards compatibility — the newer routes in courses/routes.js
  // (POST /api/users/:uid/courses/:cid) are preferred for enrolling.
  const enrollCurrentUserInCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { courseId } = req.params;
    const enrollment = await dao.enrollUserInCourse(currentUser._id, courseId);
    res.json(enrollment);
  };

  const unenrollCurrentUserFromCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { courseId } = req.params;
    const status = await dao.unenrollUserFromCourse(currentUser._id, courseId);
    res.json(status);
  };

  app.get("/api/users/current/enrollments", findMyEnrollments);
  app.get("/api/courses/:courseId/enrollments", findEnrollmentsForCourse);
  app.post("/api/courses/:courseId/enroll", enrollCurrentUserInCourse);
  app.delete("/api/courses/:courseId/enroll", unenrollCurrentUserFromCourse);
}
