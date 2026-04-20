import UsersDao from "../users/dao.js";
import EnrollmentsDao from "../enrollments/dao.js";

export default function PeopleRoutes(app, db) {
  const usersDao = UsersDao(db);
  const enrollmentsDao = EnrollmentsDao(db);

  const findUsersForCourse = async (req, res) => {
    const { courseId } = req.params;
    const enrollments = enrollmentsDao.findEnrollmentsForCourse(courseId);
    const users = (
      await Promise.all(
        enrollments.map((enrollment) => usersDao.findUserById(enrollment.user))
      )
    ).filter(Boolean);
    res.json(users);
  };

  const createUserForCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") { res.sendStatus(403); return; }
    const { courseId } = req.params;
    const newUser = await usersDao.createUser({
      ...req.body,
      loginId: req.body.loginId || req.body.username,
      section: req.body.section || "TBD",
      lastActivity: req.body.lastActivity || new Date(),
      totalActivity: req.body.totalActivity || "0:00:00",
    });
    enrollmentsDao.enrollUserInCourse(newUser._id, courseId);
    res.json(newUser);
  };

  const updateUser = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") { res.sendStatus(403); return; }
    const { userId } = req.params;
    const updatedUser = await usersDao.updateUser(userId, req.body);
    if (!updatedUser) {
      res.sendStatus(404);
      return;
    }
    res.json(updatedUser);
  };

  const deleteUser = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") { res.sendStatus(403); return; }
    const { userId } = req.params;
    await usersDao.deleteUser(userId);
    db.enrollments = db.enrollments.filter((e) => e.user !== userId);
    res.send(userId);
  };

  app.get("/api/courses/:courseId/users", findUsersForCourse);
  app.post("/api/courses/:courseId/users", createUserForCourse);
  app.put("/api/people/:userId", updateUser);
  app.delete("/api/people/:userId", deleteUser);
}
