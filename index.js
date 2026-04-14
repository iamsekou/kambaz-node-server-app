import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";

const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";

mongoose
  .connect(CONNECTION_STRING)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed, continuing with fallback data:",
      error.message
    );
  });

import Hello from "./hello.js";
import Lab5 from "./lab5/index.js";
import db from "./(kambaz)/database/index.js";
import UserRoutes from "./(kambaz)/users/routes.js";
import CourseRoutes from "./(kambaz)/courses/routes.js";
import ModulesRoutes from "./(kambaz)/modules/routes.js";
import AssignmentsRoutes from "./(kambaz)/assignments/routes.js";
import EnrollmentsRoutes from "./(kambaz)/enrollments/routes.js";
import PeopleRoutes from "./(kambaz)/people/routes.js";

// import the three new quiz-related route files
// quizzes = the quiz itself (title, dates, settings, publish toggle)
// questions = individual questions that belong to a quiz
// attempts = student submissions and scoring
import QuizzesRoutes from "./(kambaz)/quizzes/routes.js";
import QuestionsRoutes from "./(kambaz)/questions/routes.js";
import AttemptsRoutes from "./(kambaz)/attempts/routes.js";

const app = express();

app.set("trust proxy", 1);

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (
      origin === "http://localhost:3000" ||
      origin === process.env.CLIENT_URL ||
      origin.endsWith(".vercel.app")
    ) {
      callback(null, true);
      return;
    }

    callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

const isProduction =
  process.env.RENDER === "true" || process.env.SERVER_ENV === "production";

console.log(
  `Session mode: ${
    isProduction
      ? "PRODUCTION - MongoDB store, sameSite=none, secure=true"
      : "DEVELOPMENT - memory store, sameSite=lax"
  }`
);

const sessionOptions = {
  name: "kambaz.sid",
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};

if (isProduction) {
  sessionOptions.proxy = true;

  const store = MongoStore.create({
    mongoUrl: CONNECTION_STRING,
  });

  store.touch = (_sid, _session, cb) => cb(null);
  store.on("error", (err) => console.error("MongoStore error:", err));

  sessionOptions.store = store;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  };
} else {
  sessionOptions.cookie = {
    sameSite: "lax",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
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

// wire in the quiz-related routes.
// these don't need the in-memory db object because they use mongoose models directly,
// the same way the quiz dao files are already set up.
QuizzesRoutes(app);
QuestionsRoutes(app);
AttemptsRoutes(app);

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on port ${process.env.PORT || 4000}`);
});