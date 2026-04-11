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