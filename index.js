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

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Origin:", req.headers.origin);
  next();
});

app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:3000",
  "https://kambaz-next-js-coral.vercel.app",
];

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      const isAllowedExact = allowedOrigins.includes(origin);

      const isAllowedVercelPreview =
        origin.endsWith(".vercel.app") &&
        origin.includes("sekou-samassis-projects");

      if (isAllowedExact || isAllowedVercelPreview) {
        callback(null, true);
        return;
      }

      callback(new Error(`Not allowed by CORS: ${origin}`));
    },
  })
);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
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