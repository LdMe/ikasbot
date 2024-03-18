import Exercise from "../../models/exerciseModel.js";
import Subject from "../../models/subjectModel.js";
import Attempt from "../../models/attemptModel.js";
import { getAllExercises,deleteExercises } from "../exercise/exerciseController.js";

// Crud for subjects
/**
 * create a subject
 * @param {Object} data
 * @returns {Object} subject
 */
const createSubject = async (data) => {
    try {
        const subject = new Subject(data);
        await subject.save();
        return subject;
    } catch (err) {
        console.error(err);
        return null;
    }
}

/**
 * get all subjects
 * @param {String} courseId
 * @returns {Array} subjects
 */
const getAllSubjects = async (courseId=null,addExercises=true) => {
    try {
        let filter = {};
        if (courseId) {
            filter = { course: courseId };
        }
        const subjects = await Subject.find(filter);
        if(addExercises){
            const newSubjects = subjects.map(async subject => {
                const exercises = await getAllExercises(subject._id);
                return {
                    ...subject._doc,
                    exercises
                }
            });
            return await Promise.all(newSubjects);
        }
        return subjects;
    } catch (err) {
        console.error(err)
        return [];
    }
}

/**
 * get a single subject
 * @param {String} id
 * @returns {Object} subject
 */
const getSubject = async (id,isAdminOrTeacher=false) => {
    try {
        const subject = await Subject.findById(id).populate('course', 'name');
        if (subject == null) {
            return null;
        }
        const exercises = await getAllExercises(subject._id,!isAdminOrTeacher);
        const response = {
            ...subject._doc,
            exercises
        }
        return response;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

/**
 * update a single subject
 * @param {String} id
 * @param {Object} data
 * @returns {Object} subject
 */
const updateSubject = async (id, data) => {
    try {
        const { name, course } = data;
        const subject = await Subject.findById(id);
        if (subject == null) {
            return res.status(404).json({ message: 'Cannot find subject' });
        }
        if (name) {
            subject.name = name;
        }
        if (course) {
            subject.course = course;
        }
        await subject.save();
        return subject;
    } catch (err) {
        console.error(err)
        return null;
    }
}

/**
 * delete a single subject
 * @param {String} id
 * @param {Boolean} cascade
 * @returns {Object} subject
 */
const deleteSubject = async (id,cascade=true) => {
    try {
        const subject = await Subject.findById(id);
        if (subject == null) {
            return res.status(404).json({ message: 'Cannot find subject' });
        }
        if(cascade){
            // get all the exercises for this subject and the attempts for each exercise, then delete them
            const exercises = await getAllExercises(subject._id);
            const attempts = await Attempt.find({ exercise: { $in: exercises } });
            await Attempt.deleteMany({ _id: { $in: attempts } });
            await deleteExercises(subject._id);
        }
        else{
            // get all the exercises for this subject and set their subject to null
            const exercises = await getAllExercises(subject._id);
            for(const exercise of exercises){
                exercise.subject = null;
                await exercise.save();
            }
        }
        await Subject.deleteOne({ _id: id });
        return subject;
    } catch (err) {
        console.error(err)
        return null;
    }
}


export { createSubject, getAllSubjects, getSubject, updateSubject, deleteSubject };
export default { createSubject, getAllSubjects, getSubject, updateSubject, deleteSubject };
