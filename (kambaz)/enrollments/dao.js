export default function EnrollmentsDao(db) {
  function findEnrollmentsForUser(userId) {
    const { enrollments } = db;
    return enrollments.filter((enrollment) => enrollment.user === userId);
  }

  function findEnrollmentsForCourse(courseId) {
    const { enrollments } = db;
    return enrollments.filter((enrollment) => enrollment.course === courseId);
  }

  function enrollUserInCourse(userId, courseId) {
    const existingEnrollment = db.enrollments.find(
      (enrollment) =>
        enrollment.user === userId && enrollment.course === courseId
    );

    if (existingEnrollment) return existingEnrollment;

    const newEnrollment = {
      _id: new Date().getTime().toString(),
      user: userId,
      course: courseId,
    };

    db.enrollments = [...db.enrollments, newEnrollment];
    return newEnrollment;
  }

  function unenrollUserFromCourse(userId, courseId) {
    db.enrollments = db.enrollments.filter(
      (enrollment) =>
        !(enrollment.user === userId && enrollment.course === courseId)
    );
    return courseId;
  }

  return {
    findEnrollmentsForUser,
    findEnrollmentsForCourse,
    enrollUserInCourse,
    unenrollUserFromCourse,
  };
}