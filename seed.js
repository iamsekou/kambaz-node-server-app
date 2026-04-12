/**
 * seed.js — run once to populate MongoDB Atlas with the starter data.
 * Usage:  node seed.js
 *
 * Reads DATABASE_CONNECTION_STRING from .env (or falls back to localhost).
 * Clears and re-inserts courses, users, and enrollments so the app has
 * real data to work with after the Mongoose migration.
 */

import "dotenv/config";
import mongoose from "mongoose";

// ── connection ──────────────────────────────────────────────────────────────

const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING ||
  "mongodb://127.0.0.1:27017/kambaz";

await mongoose.connect(CONNECTION_STRING);
console.log("Connected to MongoDB:", CONNECTION_STRING.split("@").pop()); // hide credentials

// ── schemas / models ────────────────────────────────────────────────────────

const lessonSchema = new mongoose.Schema(
  { _id: String, name: String, description: String, module: String },
  { _id: false }
);

const moduleSchema = new mongoose.Schema(
  { _id: String, name: String, description: String, course: String, lessons: [lessonSchema] }
);

const courseSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    number: String,
    startDate: String,
    endDate: String,
    department: String,
    credits: Number,
    description: String,
    image: String,
    modules: [moduleSchema],
  },
  { collection: "courses" }
);

const userSchema = new mongoose.Schema(
  {
    _id: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    email: String,
    role: {
      type: String,
      enum: ["STUDENT", "FACULTY", "ADMIN", "USER", "TA"],
      default: "USER",
    },
  },
  { collection: "users" }
);

const enrollmentSchema = new mongoose.Schema(
  {
    _id: String,
    course: { type: String, ref: "CourseModel" },
    user:   { type: String, ref: "UserModel" },
    status: { type: String, default: "ENROLLED" },
  },
  { collection: "enrollments" }
);

// Use existing models if already registered (safe for re-runs)
const CourseModel      = mongoose.models.CourseModel      || mongoose.model("CourseModel",      courseSchema);
const UserModel        = mongoose.models.UserModel        || mongoose.model("UserModel",        userSchema);
const EnrollmentModel  = mongoose.models.EnrollmentModel  || mongoose.model("EnrollmentModel",  enrollmentSchema);

// ── seed data ───────────────────────────────────────────────────────────────

const courses = [
  {
    _id: "RS101",
    name: "Rocket Propulsion",
    number: "RS4550",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "This course covers the fundamentals of rocket propulsion.",
    modules: [
      {
        _id: "M101",
        name: "Introduction to Propulsion",
        description: "Overview of rocket propulsion principles",
        course: "RS101",
        lessons: [],
      },
      {
        _id: "M102",
        name: "Rocket Engines",
        description: "Types and mechanics of rocket engines",
        course: "RS101",
        lessons: [],
      },
      {
        _id: "M103",
        name: "Propellants",
        description: "Solid, liquid, and hybrid propellants",
        course: "RS101",
        lessons: [],
      },
    ],
  },
  {
    _id: "RS102",
    name: "Aerodynamics",
    number: "RS4560",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "This course explores the principles of aerodynamics.",
    modules: [
      {
        _id: "M201",
        name: "Aerodynamics Basics",
        description: "Lift, drag, and airflow fundamentals",
        course: "RS102",
        lessons: [],
      },
      {
        _id: "M202",
        name: "Supersonic Flight",
        description: "Aerodynamics at supersonic speeds",
        course: "RS102",
        lessons: [],
      },
    ],
  },
  {
    _id: "RS103",
    name: "Space Mission Design",
    number: "RS4570",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "This course focuses on planning and designing space missions.",
    modules: [
      {
        _id: "M301",
        name: "Mission Planning",
        description: "Goals, requirements, and constraints",
        course: "RS103",
        lessons: [],
      },
      {
        _id: "M302",
        name: "Launch Windows",
        description: "Calculating and selecting launch windows",
        course: "RS103",
        lessons: [],
      },
    ],
  },
  {
    _id: "RS104",
    name: "Spacecraft Design",
    number: "RS4580",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "This course covers the design and construction of spacecraft.",
    modules: [
      {
        _id: "M401",
        name: "Spacecraft Structures",
        description: "Structural design for space environments",
        course: "RS104",
        lessons: [],
      },
    ],
  },
  {
    _id: "RS105",
    name: "Orbital Mechanics",
    number: "RS4590",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "This course dives into the mathematics of orbital motion.",
    modules: [
      {
        _id: "M501",
        name: "Kepler's Laws",
        description: "Laws of planetary motion and orbit shapes",
        course: "RS105",
        lessons: [],
      },
      {
        _id: "M502",
        name: "Orbital Transfers",
        description: "Hohmann transfers and delta-v calculations",
        course: "RS105",
        lessons: [],
      },
    ],
  },
];

const users = [
  {
    _id: "1",
    username: "admin",
    password: "admin",
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    role: "FACULTY",
  },
  {
    _id: "2",
    username: "alice",
    password: "alice123",
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@example.com",
    role: "STUDENT",
  },
  {
    _id: "3",
    username: "ada",
    password: "123",
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@lovelace.com",
    role: "ADMIN",
  },
];

const enrollments = [
  { _id: "1", user: "2", course: "RS101" },
  { _id: "2", user: "2", course: "RS102" },
  { _id: "3", user: "1", course: "RS101" },
  { _id: "4", user: "1", course: "RS103" },
];

// ── insert ───────────────────────────────────────────────────────────────────

async function seed(Model, data, label) {
  await Model.deleteMany({});
  const result = await Model.insertMany(data);
  console.log(`✓ Seeded ${result.length} ${label}`);
}

await seed(CourseModel,     courses,     "courses");
await seed(UserModel,       users,       "users");
await seed(EnrollmentModel, enrollments, "enrollments");

await mongoose.disconnect();
console.log("Done. Disconnected from MongoDB.");
