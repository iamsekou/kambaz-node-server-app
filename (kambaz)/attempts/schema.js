import mongoose from "mongoose";

// schema for a student's quiz attempt.
// every time a student submits a quiz, we create one of these documents.
// each student gets their own attempt records, separate from other students.
const attemptSchema = new mongoose.Schema(
  {
    _id: String,

    // which quiz this attempt is for
    quiz: 
    
    { type: String, ref: "QuizModel" },

    // which student submitted this attempt (the user's _id)
    student: { type: String, ref: "UserModel" },

    // the student's answers one entry per question.
    // each entry links the question id to what the student answered.
    // for multiple choice: answer is the text of the choice they picked
    // for true/false: answer is "true" or "false"
    // for fill in the blank: answer is whatever they typed in
    answers: [
      {
        _id: false, // no auto-id for sub-docs here
        questionId: String,
        answer: String,
      },
    ],

    // the calculated score for this attempt (points earned out of total possible)
    score: { type: Number, default: 0 },

    // which attempt number this is for this student on this quiz
    // (1st try = 1, 2nd try = 2, etc.)
    attemptNumber: 
    
    { type: Number, default: 1 },

    // when the student actually hit submit
    submittedAt: 
    
    { type: Date, default: Date.now },
  },
  { collection: "attempts" }
);

export default attemptSchema;
