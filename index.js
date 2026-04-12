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
    console.error("MongoDB connection failed, continuing with fallback data:", error.message);
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

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }
    // allow localhost and any vercel deployment of your project
    if (
      origin === "http://localhost:3000" ||
      origin.endsWith(".vercel.app") ||
      origin === process.env.CLIENT_URL
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

// Render automatically injects RENDER=true into every deployment.
// Fall back to SERVER_ENV=production for local production-mode testing.
const isProduction = process.env.RENDER === "true" ||
                     process.env.SERVER_ENV === "production";

console.log(`Session mode: ${isProduction
  ? "PRODUCTION — MongoDB store, sameSite=none, secure=true"
  : "DEVELOPMENT — memory store, sameSite=lax"}`);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};

if (isProduction) {
  sessionOptions.proxy = true;
  const store = MongoStore.create({
    mongoUrl: CONNECTION_STRING,
    // DO NOT pass `crypto` here.
    // connect-mongo v5 has a bug: when `crypto` is set with the default
    // `stringify: true`, the `get` method double-parses session data —
    // `decryptSession` already JSON.parses the plaintext, then `unserialize`
    // (= JSON.parse) is called again on the already-parsed object, giving
    // JSON.parse("[object Object]") → SyntaxError.  That error is caught and
    // forwarded to express-session, which creates a fresh empty session on
    // every request, making req.session.currentUser always null → 401.
    // Storing sessions without encryption is fine for a class project.
  });
  // connect-mongo v5 also has a bug in touch() where it crashes with
  // "Cannot read properties of null (reading 'length')" when sessions have
  // no cookie expiry.  Replace with a safe no-op.
  store.touch = (_sid, _session, cb) => cb(null);
  store.on("error", (err) => console.error("MongoStore error:", err));
  sessionOptions.store = store;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours — survives Render cold-starts
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

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on port ${process.env.PORT || 4000}`);
});
