import UsersDao from "../users/dao.js";
import EnrollmentsDao from "../enrollments/dao.js";

export default function PeopleRoutes(app, db) {
  const usersDao = UsersDao(db);
  const enrollmentsDao = EnrollmentsDao(db);

  const findUsersForCourse = (req, res) => {
    const { courseId } = req.params;
    const enrollments = enrollmentsDao.findEnrollmentsForCourse(courseId);
    const users = enrollments
      .map((enrollment) => usersDao.findUserById(enrollment.user))
      .filter(Boolean);
    res.json(users);
  };

  const createUserForCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") {
      res.sendStatus(403);
      return;
    }

    const { courseId } = req.params;
    const newUser = usersDao.createUser(req.body);
    enrollmentsDao.enrollUserInCourse(newUser._id, courseId);
    res.json(newUser);
  };

  const updateUser = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") {
      res.sendStatus(403);
      return;
    }

    const { userId } = req.params;
    const updates = req.body;
    const updatedUser = usersDao.updateUser(userId, updates);
    res.json(updatedUser);
  };

  const deleteUser = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") {
      res.sendStatus(403);
      return;
    }

    const { userId } = req.params;
    usersDao.deleteUser(userId);
    db.enrollments = db.enrollments.filter((e) => e.user !== userId);
    res.send(userId);
  };

  app.get("/api/courses/:courseId/users", findUsersForCourse);
  app.post("/api/courses/:courseId/users", createUserForCourse);
  app.put("/api/people/:userId", updateUser);
  app.delete("/api/people/:userId", deleteUser);
}