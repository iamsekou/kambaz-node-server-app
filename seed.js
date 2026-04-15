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

const quizSchema = new mongoose.Schema(
  {
    _id: String,
    title: { type: String, default: "Unnamed Quiz" },
    course: { type: String, ref: "CourseModel" },
    description: { type: String, default: "" },
    quizType: {
      type: String,
      enum: ["GRADED_QUIZ", "PRACTICE_QUIZ", "GRADED_SURVEY", "UNGRADED_SURVEY"],
      default: "GRADED_QUIZ",
    },
    points: { type: Number, default: 0 },
    assignmentGroup: {
      type: String,
      enum: ["QUIZZES", "EXAMS", "ASSIGNMENTS", "PROJECT"],
      default: "QUIZZES",
    },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 },
    multipleAttempts: { type: Boolean, default: false },
    howManyAttempts: { type: Number, default: 1 },
    showCorrectAnswers: { type: String, default: "immediately" },
    accessCode: { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    dueDate: { type: String, default: "" },
    availableDate: { type: String, default: "" },
    untilDate: { type: String, default: "" },
    published: { type: Boolean, default: false },
  },
  { collection: "quizzes" }
);

const questionSchema = new mongoose.Schema(
  {
    _id: String,
    quiz: { type: String, ref: "QuizModel" },
    title: { type: String, default: "New Question" },
    type: {
      type: String,
      enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_IN_BLANK"],
      default: "MULTIPLE_CHOICE",
    },
    points: { type: Number, default: 1 },
    question: { type: String, default: "" },
    choices: [{ _id: false, text: String, isCorrect: { type: Boolean, default: false } }],
    correctAnswer: { type: String, default: "" },
    correctAnswers: [{ type: String }],
  },
  { collection: "questions" }
);

const attemptSchema = new mongoose.Schema(
  {
    _id: String,
    quiz: { type: String, ref: "QuizModel" },
    student: { type: String, ref: "UserModel" },
    answers: [{ _id: false, questionId: String, answer: String, correct: Boolean, pointsEarned: Number }],
    score: { type: Number, default: 0 },
    attemptNumber: { type: Number, default: 1 },
    submittedAt: { type: Date, default: Date.now },
  },
  { collection: "attempts" }
);

// Use existing models if already registered (safe for re-runs)
const CourseModel      = mongoose.models.CourseModel      || mongoose.model("CourseModel",      courseSchema);
const UserModel        = mongoose.models.UserModel        || mongoose.model("UserModel",        userSchema);
const EnrollmentModel  = mongoose.models.EnrollmentModel  || mongoose.model("EnrollmentModel",  enrollmentSchema);
const QuizModel        = mongoose.models.QuizModel        || mongoose.model("QuizModel",        quizSchema);
const QuestionModel    = mongoose.models.QuestionModel    || mongoose.model("QuestionModel",    questionSchema);
const AttemptModel     = mongoose.models.AttemptModel     || mongoose.model("AttemptModel",     attemptSchema);

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

const quizzes = [
  {
    _id: "QZ101",
    title: "Rocket Propulsion Basics",
    course: "RS101",
    description: "covers the fundamental principles of rocket propulsion.",
    quizType: "GRADED_QUIZ",
    points: 10,
    assignmentGroup: "QUIZZES",
    shuffleAnswers: true,
    timeLimit: 20,
    multipleAttempts: false,
    howManyAttempts: 1,
    showCorrectAnswers: "immediately",
    accessCode: "",
    oneQuestionAtATime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    dueDate: "2026-05-15T23:59",
    availableDate: "2026-05-01T00:00",
    untilDate: "2026-05-15T23:59",
    published: true,
  },
  {
    _id: "QZ102",
    title: "Aerodynamics Mid-Term",
    course: "RS102",
    description: "covers lift, drag, and bernoulli's principle.",
    quizType: "GRADED_QUIZ",
    points: 15,
    assignmentGroup: "EXAMS",
    shuffleAnswers: false,
    timeLimit: 30,
    multipleAttempts: true,
    howManyAttempts: 2,
    showCorrectAnswers: "immediately",
    accessCode: "",
    oneQuestionAtATime: false,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    dueDate: "2026-05-20T23:59",
    availableDate: "2026-05-10T00:00",
    untilDate: "2026-05-20T23:59",
    published: true,
  },
  {
    _id: "QZ103",
    title: "Engine Systems Draft",
    course: "RS101",
    description: "draft quiz - not published yet so students cannot see it.",
    quizType: "PRACTICE_QUIZ",
    points: 5,
    assignmentGroup: "QUIZZES",
    shuffleAnswers: true,
    timeLimit: 10,
    multipleAttempts: false,
    howManyAttempts: 1,
    showCorrectAnswers: "immediately",
    accessCode: "",
    oneQuestionAtATime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    dueDate: "2026-06-01T23:59",
    availableDate: "2026-05-25T00:00",
    untilDate: "2026-06-01T23:59",
    published: false,
  },
];

const questions = [
  {
    _id: "QN101",
    quiz: "QZ101",
    title: "Newton's Third Law",
    type: "TRUE_FALSE",
    points: 2,
    question: "Newton's third law states that every action has an equal and opposite reaction.",
    choices: [],
    correctAnswer: "true",
    correctAnswers: [],
  },
  {
    _id: "QN102",
    quiz: "QZ101",
    title: "Specific Impulse Units",
    type: "MULTIPLE_CHOICE",
    points: 4,
    question: "what is the unit of specific impulse (Isp)?",
    choices: [
      { text: "Newtons", isCorrect: false },
      { text: "Seconds", isCorrect: true },
      { text: "Kilograms", isCorrect: false },
      { text: "Meters per second", isCorrect: false },
    ],
    correctAnswer: "",
    correctAnswers: [],
  },
  {
    _id: "QN103",
    quiz: "QZ101",
    title: "Exhaust Velocity",
    type: "FILL_IN_BLANK",
    points: 4,
    question: "the velocity at which exhaust gases exit the nozzle is called _______ velocity.",
    choices: [],
    correctAnswer: "",
    correctAnswers: ["exhaust", "exit", "effective exhaust"],
  },
  {
    _id: "QN104",
    quiz: "QZ102",
    title: "Bernoulli's Principle",
    type: "TRUE_FALSE",
    points: 5,
    question: "bernoulli's principle states that as fluid speed increases, pressure decreases.",
    choices: [],
    correctAnswer: "true",
    correctAnswers: [],
  },
  {
    _id: "QN105",
    quiz: "QZ102",
    title: "Lift Generation",
    type: "MULTIPLE_CHOICE",
    points: 10,
    question: "which shape of wing cross-section generates the most lift?",
    choices: [
      { text: "Flat plate", isCorrect: false },
      { text: "Symmetric airfoil", isCorrect: false },
      { text: "Cambered airfoil", isCorrect: true },
      { text: "Rectangular block", isCorrect: false },
    ],
    correctAnswer: "",
    correctAnswers: [],
  },
];

// one sample attempt from alice (student id "2") on QZ101 so the results screen has data to show
const attempts = [
  {
    _id: "AT101",
    quiz: "QZ101",
    student: "2",
    answers: [
      { questionId: "QN101", answer: "true",    correct: true,  pointsEarned: 2 },
      { questionId: "QN102", answer: "Seconds",  correct: true,  pointsEarned: 4 },
      { questionId: "QN103", answer: "exhaust",  correct: true,  pointsEarned: 4 },
    ],
    score: 10,
    attemptNumber: 1,
    submittedAt: new Date("2026-05-02T14:30:00"),
  },
];

await seed(CourseModel,     courses,     "courses");
await seed(UserModel,       users,       "users");
await seed(EnrollmentModel, enrollments, "enrollments");
await seed(QuizModel,       quizzes,     "quizzes");
await seed(QuestionModel,   questions,   "questions");
await seed(AttemptModel,    attempts,    "attempts");

await mongoose.disconnect();
console.log("Done. Disconnected from MongoDB.");
