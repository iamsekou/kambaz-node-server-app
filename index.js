import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import Hello from "./hello.js";
import Lab5 from "./lab5/index.js";
import db from "./(kambaz)/database/index.js";
import UserRoutes from "./(kambaz)/users/routes.js";
import CourseRoutes from "./(kambaz)/courses/routes.js";
import ModulesRoutes from "./(kambaz)/modules/routes.js";
import AssignmentsRoutes from "./(kambaz)/assignments/routes.js";
import EnrollmentsRoutes from "./(kambaz)/enrollments/routes.js";
import PeopleRoutes from "./(kambaz)/people/routes.js";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  cookie: {},
};

if (process.env.SERVER_ENV !== "development") {
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
}

app.use(session(sessionOptions));
app.use(express.json());

Hello(app);
Lab5(app);
UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentsRoutes(app, db);
EnrollmentsRoutes(app, db);
PeopleRoutes(app, db);

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running");
});