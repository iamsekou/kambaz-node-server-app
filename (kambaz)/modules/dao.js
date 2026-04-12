import { v4 as uuidv4 } from "uuid";
import model from "../courses/model.js";

export default function ModulesDao(db) {
  const findModulesForCourse = async (courseId) => {
    const course = await model.findById(courseId);
    return course ? course.modules : [];
  };

  const createModule = async (courseId, module) => {
    const newModule = { ...module, _id: uuidv4(), course: courseId };
    await model.updateOne(
      { _id: courseId },
      { $push: { modules: newModule } }
    );
    return newModule;
  };

  const deleteModule = async (courseId, moduleId) => {
    await model.updateOne(
      { _id: courseId },
      { $pull: { modules: { _id: moduleId } } }
    );
    return moduleId;
  };

  const updateModule = async (courseId, moduleId, moduleUpdates) => {
    const course = await model.findById(courseId);
    if (!course) return null;
    const module = course.modules.id(moduleId);
    if (!module) return null;
    Object.assign(module, moduleUpdates);
    await course.save();
    return module;
  };

  return {
    findModulesForCourse,
    createModule,
    deleteModule,
    updateModule,
  };
}
