import mongoose from "mongoose";

// this schema defines the shape of a quiz document stored in mongodb.
// it mirrors all the fields a faculty can configure in the quiz editor screen.
const quizSchema = new mongoose.Schema(
  {
    _id: String,

    // the title of the quiz, like "Midterm Exam" or "Week 3 Quiz"
    title: { type: String, default: "Unnamed Quiz" },

    // which course this quiz belongs to - matches the course _id
    course: { type: String, ref: "CourseModel" },

    // optional description / instructions shown to students before they start
    description: { type: String, default: "" },

    // the type of quiz - graded quiz is the most common
    quizType: {
      type: String,
      enum: ["GRADED_QUIZ", "PRACTICE_QUIZ", "GRADED_SURVEY", "UNGRADED_SURVEY"],
      default: "GRADED_QUIZ",
    },

    // total points for the quiz. we recalculate this when questions are saved,
    // but we also store it here so the list screen can show it without loading questions
    points: { type: Number, default: 0 },

    // which assignment group bucket this quiz falls under
    assignmentGroup: {
      type: String,
      enum: ["QUIZZES", "EXAMS", "ASSIGNMENTS", "PROJECT"],
      default: "QUIZZES",
    },

    // whether to shuffle the answer choices randomly for each student
    shuffleAnswers: { type: Boolean, default: true },

    // how many minutes students have to finish once they start (0 = no limit)
    timeLimit: { type: Number, default: 20 },

    // if true, students can retake the quiz up to howManyAttempts times
    multipleAttempts: { type: Boolean, default: false },

    // the max number of times a student can submit the quiz
    howManyAttempts: { type: Number, default: 1 },

    // when/whether to reveal the correct answers to students after submission
    showCorrectAnswers: { type: String, default: "immediately" },

    // optional passcode students must enter to unlock the quiz
    accessCode: { type: String, default: "" },

    // show one question at a time instead of all questions on one page
    oneQuestionAtATime: { type: Boolean, default: true },

    // whether a webcam is required to take the quiz (respondus-style)
    webcamRequired: { type: Boolean, default: false },

    // lock the question after the student answers it so they can't go back
    lockQuestionsAfterAnswering: { type: Boolean, default: false },

    // date the quiz is due
    dueDate: { type: String, default: "" },

    // date when the quiz becomes available for students to take
    availableDate: { type: String, default: "" },

    // date when the quiz closes and is no longer available
    untilDate: { type: String, default: "" },

    // published quizzes are visible to students; unpublished are hidden
    published: { type: Boolean, default: false },
  },
  { collection: "quizzes" }
);

export default quizSchema;
