import { v4 as uuidv4 } from "uuid";
import model from "../courses/model.js";
import moduleModel from "./model.js";

export default function ModulesDao(db) {
  const findModulesInMemoryForCourse = (courseId) =>
    (db.modules || []).filter((module) => module.course === courseId);

  const canUseMongo = () => moduleModel.db?.readyState === 1;

  const findModulesForCourse = async (courseId) => {
    if (!canUseMongo()) {
      return findModulesInMemoryForCourse(courseId);
    }

    const course = await model.findById(courseId);
    const embeddedModules = course?.modules
      ? course.modules.map((module) => module.toObject?.() ?? module)
      : [];
    const standaloneModules = await moduleModel.find({ course: courseId }).lean();
    const inMemoryModules = findModulesInMemoryForCourse(courseId);

    const mergedModules = [...embeddedModules, ...standaloneModules, ...inMemoryModules];
    return mergedModules.filter(
      (module, index, modules) =>
        index === modules.findIndex((candidate) => candidate._id === module._id)
    );
  };

  const createModule = async (courseId, module) => {
    const newModule = { ...module, _id: uuidv4(), course: courseId };
    db.modules = [...(db.modules || []), newModule];
    if (canUseMongo()) {
      await moduleModel.create(newModule);
      await model.updateOne({ _id: courseId }, { $push: { modules: newModule } });
    }
    return newModule;
  };

  const deleteModule = async (courseId, moduleId) => {
    db.modules = (db.modules || []).filter((module) => module._id !== moduleId);
    if (canUseMongo()) {
      await moduleModel.deleteOne({ _id: moduleId });
      await model.updateOne({ _id: courseId }, { $pull: { modules: { _id: moduleId } } });
    }
    return moduleId;
  };

  const updateModule = async (courseId, moduleId, moduleUpdates) => {
    db.modules = (db.modules || []).map((module) =>
      module._id === moduleId ? { ...module, ...moduleUpdates } : module
    );
    if (!canUseMongo()) {
      return (db.modules || []).find((module) => module._id === moduleId) || null;
    }

    await moduleModel.updateOne({ _id: moduleId }, { $set: moduleUpdates }, { upsert: false });
    const course = await model.findById(courseId);
    if (!course) {
      return (
        (await moduleModel.findById(moduleId).lean()) ||
        (db.modules || []).find((module) => module._id === moduleId) ||
        null
      );
    }
    const module = course.modules.id(moduleId);
    if (!module) {
      return (
        (await moduleModel.findById(moduleId).lean()) ||
        (db.modules || []).find((item) => item._id === moduleId) ||
        null
      );
    }
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
