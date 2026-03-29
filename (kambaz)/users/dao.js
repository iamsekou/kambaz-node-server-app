import { v4 as uuidv4 } from "uuid";

export default function UsersDao(db) {
  function createUser(user) {
    const newUser = { ...user, _id: uuidv4() };
    db.users = [...db.users, newUser];
    return newUser;
  }

  function findAllUsers() {
    return db.users;
  }

  function findUserById(userId) {
    return db.users.find((user) => user._id === userId);
  }

  function findUserByUsername(username) {
    return db.users.find((user) => user.username === username);
  }

  function findUserByCredentials(username, password) {
    return db.users.find(
      (user) => user.username === username && user.password === password
    );
  }

  function updateUser(userId, user) {
    db.users = db.users.map((u) => (u._id === userId ? user : u));
    return findUserById(userId);
  }

  function deleteUser(userId) {
    db.users = db.users.filter((u) => u._id !== userId);
    return userId;
  }

  return {
    createUser,
    findAllUsers,
    findUserById,
    findUserByUsername,
    findUserByCredentials,
    updateUser,
    deleteUser,
  };
}