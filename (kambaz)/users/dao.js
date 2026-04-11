import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function UsersDao(db) {
  const createUser = async (user) => {
    // Assign a string _id since our schema uses String for _id
    const newUser = { ...user, _id: uuidv4() };
    return model.create(newUser);
  };

  const findAllUsers = () => model.find();

  const findUserById = (userId) => model.findById(userId);

  const findUserByUsername = (username) =>
    model.findOne({ username: username });

  const findUserByCredentials = (username, password) =>
    model.findOne({ username, password });

  const updateUser = (userId, user) =>
    model.findByIdAndUpdate(userId, { $set: user }, { new: true });

  const deleteUser = (userId) => model.findByIdAndDelete(userId);

  // Retrieve documents by role predicate
  const findUsersByRole = (role) => model.find({ role: role });

  // Retrieve documents by partial first or last name using regex
  const findUsersByPartialName = (partialName) => {
    const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
    return model.find({
      $or: [
        { firstName: { $regex: regex } },
        { lastName: { $regex: regex } },
      ],
    });
  };

  return {
    createUser,
    findAllUsers,
    findUserById,
    findUserByUsername,
    findUserByCredentials,
    updateUser,
    deleteUser,
    findUsersByRole,
    findUsersByPartialName,
  };
}
