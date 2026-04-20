import mongoose from "mongoose";

// schema for an individual question inside a quiz.
// a quiz can have many questions and each question points back to its parent quiz.
const questionSchema = new mongoose.Schema(
  {
    _id: String,

    // which quiz the question belongs to
    quiz: { type: String, ref: "QuizModel" },

    // a short label/name for the question, like "Question 1" or "Propulsion Basics"
    title: { type: String, default: "New Question" },

    // the three supported question types 
    type: {
      type: String,
      enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_IN_BLANK"],
      default: "MULTIPLE_CHOICE",
    },

    // how many points the question is worth when graded
    points: { type: Number, default: 1 },

    // the actual question text shown to the student 
    question: { type: String, default: "" },


    // an array of answer choices for MC.. each one has the text and whether it's the right answer.
    // example: if text = "4" and isCorrect is true }, then that means text: "5" isCorrect = false }]
    choices: [
      {
        _id: false, // don't auto-generate an id for each choice object
        text: String,
        isCorrect: { type: Boolean, default: false },
      },
    ],

    // 
    // stores t/f as a string representing the correct answer
    correctAnswer: { type: String, default: "" },

    // for fill in da blank  
    // a list of acceptable correct answers (case-insensitive matching happens in the attempt grader)
    // example: ["4", "four", "cuatro"]
    correctAnswers: [{ type: String }],
  },
  { collection: "questions" }
);

export default questionSchema;
