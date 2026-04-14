const db = {
  users: [
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
  ],

  courses: [
    {
      _id: "RS101",
      name: "Rocket Propulsion",
      number: "RS4550",
      startDate: "2023-09-10",
      endDate: "2023-12-15",
      image: "/images/reactjs.jpg",
      description: "This course covers the fundamentals of rocket propulsion.",
    },
    {
      _id: "RS102",
      name: "Aerodynamics",
      number: "RS4560",
      startDate: "2023-09-10",
      endDate: "2023-12-15",
      image: "/images/reactjs.jpg",
      description: "This course explores the principles of aerodynamics.",
    },
    {
      _id: "RS103",
      name: "Space Mission Design",
      number: "RS4570",
      startDate: "2023-09-10",
      endDate: "2023-12-15",
      image: "/images/reactjs.jpg",
      description: "This course focuses on planning and designing space missions.",
    },
  ],

  enrollments: [
    { _id: "1", user: "2", course: "RS101" },
    { _id: "2", user: "2", course: "RS102" },
    { _id: "3", user: "1", course: "RS101" },
    { _id: "4", user: "1", course: "RS103" },
  ],

  modules: [
    {
      _id: "M101",
      name: "Introduction",
      description: "Intro to rockets",
      course: "RS101",
      lessons: [],
    },
    {
      _id: "M102",
      name: "Rocket Engines",
      description: "Engine fundamentals",
      course: "RS101",
      lessons: [],
    },
    {
      _id: "M103",
      name: "Aerodynamics Basics",
      description: "Lift and drag",
      course: "RS102",
      lessons: [],
    },
    {
      _id: "M104",
      name: "Mission Planning",
      description: "Planning missions",
      course: "RS103",
      lessons: [],
    },
  ],

  // ── quizzes ──────────────────────────────────────────────────────────────
  // these are sample quizzes tied to the RS101 and RS102 courses above.
  // quizzes that are published=true will be visible to students right away.
  quizzes: [
    {
      _id: "QZ101",
      title: "Rocket Propulsion Basics",
      course: "RS101",
      description: "covers the fundamental principles of rocket propulsion.",
      quizType: "GRADED_QUIZ",
      points: 10, // this gets recalculated when questions are saved via the api
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
      description: "draft quiz - not published yet so students can't see it.",
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
      published: false, // hidden from students until faculty publishes it
    },
  ],

  // ── questions ─────────────────────────────────────────────────────────────
  // sample questions for QZ101. each one points back to its quiz via the quiz field.
  questions: [
    {
      _id: "QN101",
      quiz: "QZ101",
      title: "Newton's Third Law",
      type: "TRUE_FALSE",
      points: 2,
      question:
        "Newton's third law states that every action has an equal and opposite reaction.",
      choices: [],
      correctAnswer: "true", // the correct answer for this true/false question
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
        { text: "Seconds", isCorrect: true }, // this is the right answer
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
      question:
        "the velocity at which exhaust gases exit the nozzle is called _______ velocity.",
      choices: [],
      correctAnswer: "",
      // any of these answers (case-insensitive) counts as correct
      correctAnswers: ["exhaust", "exit", "effective exhaust"],
    },
    {
      _id: "QN104",
      quiz: "QZ102",
      title: "Bernoulli's Principle",
      type: "TRUE_FALSE",
      points: 5,
      question:
        "bernoulli's principle states that as fluid speed increases, pressure decreases.",
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
        { text: "Cambered airfoil", isCorrect: true }, // correct answer
        { text: "Rectangular block", isCorrect: false },
      ],
      correctAnswer: "",
      correctAnswers: [],
    },
  ],

  // ── attempts ──────────────────────────────────────────────────────────────
  // sample attempt showing what it looks like after student "alice" (user _id "2")
  // submits QZ101. this is here so maryam has something to test the results screen with.
  attempts: [
    {
      _id: "AT101",
      quiz: "QZ101",
      student: "2", // alice's user id
      answers: [
        { questionId: "QN101", answer: "true", correct: true, pointsEarned: 2 },
        { questionId: "QN102", answer: "Seconds", correct: true, pointsEarned: 4 },
        { questionId: "QN103", answer: "exhaust", correct: true, pointsEarned: 4 },
      ],
      score: 10,
      attemptNumber: 1,
      submittedAt: new Date("2026-05-02T14:30:00"),
    },
  ],

  assignments: [
    {
      _id: "A101",
      title: "Propulsion Homework",
      description: "Solve rocket propulsion problems.",
      points: 100,
      due: "2026-05-13T23:59",
      availableFrom: "2026-05-06T00:00",
      availableUntil: "2026-05-13T23:59",
      course: "RS101",
    },
    {
      _id: "A102",
      title: "Engine Analysis",
      description: "Analyze rocket engine designs.",
      points: 100,
      due: "2026-05-20T23:59",
      availableFrom: "2026-05-13T00:00",
      availableUntil: "2026-05-20T23:59",
      course: "RS101",
    },
    {
      _id: "A103",
      title: "Aerodynamics Quiz Prep",
      description: "Prepare notes for lift and drag quiz.",
      points: 50,
      due: "2026-05-18T23:59",
      availableFrom: "2026-05-11T00:00",
      availableUntil: "2026-05-18T23:59",
      course: "RS102",
    },
  ],
};

export default db;