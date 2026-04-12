import UsersDao from "./dao.js";

export default function UserRoutes(app, db) {
  const dao = UsersDao(db);

  // ── Auth routes ─────────────────────────────────────────────────────────────

  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const currentUser = await dao.createUser({
      ...req.body,
      firstName: req.body.firstName || req.body.username,
      lastName: req.body.lastName || "",
      loginId: req.body.loginId || req.body.username,
    });
    // regenerate() destroys the current session and issues a brand-new session
    // ID.  This overwrites any stale/duplicate connect.sid cookies the browser
    // accumulated across redeployments, preventing the old encrypted-session
    // cookie from shadowing the new valid one.
    req.session.regenerate((err) => {
      if (err) { console.error("Session regenerate error on signup:", err); res.status(500).json({ message: "Session error" }); return; }
      req.session["currentUser"] = currentUser;
      req.session.save((err) => {
        if (err) { console.error("Session save error on signup:", err); }
        res.json(currentUser);
      });
    });
  };

  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (!currentUser) {
      res.status(401).json({ message: "Unable to login. Try again later." });
      return;
    }
    // Same regenerate pattern — guarantees a single fresh session cookie on
    // every login regardless of what stale cookies the browser is carrying.
    req.session.regenerate((err) => {
      if (err) { console.error("Session regenerate error on signin:", err); res.status(500).json({ message: "Session error" }); return; }
      req.session["currentUser"] = currentUser;
      req.session.save((err) => {
        if (err) { console.error("Session save error on signin:", err); }
        res.json(currentUser);
      });
    });
  };

  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  // ── CRUD routes ──────────────────────────────────────────────────────────────

  // GET /api/users — retrieve all users, optionally filtered by role or name
  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }
    if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }
    const users = await dao.findAllUsers();
    res.json(users);
  };

  // GET /api/users/:userId — retrieve a single user by primary key
  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
  };

  // DELETE /api/users/:userId — delete a user document
  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };

  // PUT /api/users/:userId — update a user document
  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const userUpdates = req.body;
    const updatedUser = await dao.updateUser(userId, userUpdates);
    if (!updatedUser) {
      res.sendStatus(404);
      return;
    }
    const currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === userId) {
      req.session["currentUser"] = updatedUser;
    }
    res.json(updatedUser);
  };

  // POST /api/users — create a new user
  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };

  // ── Route registrations ──────────────────────────────────────────────────────
  app.post("/api/users", createUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/profile", profile);
  app.post("/api/users/signout", signout);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
}
