import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
  const dao = AssignmentsDao(db);

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

  const findAssignmentsForCourse = async (req, res) => {
    const { courseId } = req.params;
    const assignments = await dao.findAssignmentsForCourse(courseId);
    res.json(assignments);
  };

  const findAssignmentById = async (req, res) => {
    const { assignmentId } = req.params;
    const assignment = await dao.findAssignmentById(assignmentId);
    res.json(assignment);
  };

  const createAssignmentForCourse = async (req, res) => {
    if (!requireFaculty(req, res)) return;
    const { courseId } = req.params;
    const assignment = { ...req.body, course: courseId };
    const newAssignment = await dao.createAssignment(assignment);
    res.json(newAssignment);
  };

  const deleteAssignment = async (req, res) => {
    if (!requireFaculty(req, res)) return;
    const { assignmentId } = req.params;
    const status = await dao.deleteAssignment(assignmentId);
    res.json(status);
  };

  const updateAssignment = async (req, res) => {
    if (!requireFaculty(req, res)) return;
    const { assignmentId } = req.params;
    const assignmentUpdates = req.body;
    const status = await dao.updateAssignment(assignmentId, assignmentUpdates);
    res.json(status);
  };

  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.get("/api/assignments/:assignmentId", findAssignmentById);
  app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
  app.put("/api/assignments/:assignmentId", updateAssignment);
}
