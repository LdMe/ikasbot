import Exercise from "../models/exerciseModel.js";
import Subject from "../models/subjectModel.js";
import Attempt from "../models/attemptModel.js";
// Crud for subjects
/**
 * create a subject
 * @param {Object} req
 * @param {Object} res
 */
const createSubject = async (req, res) => {
    try {
        const subject = new Subject(req.body);
        await subject.save();
        res.status(201).json(subject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

/**
 * get all subjects
 * @param {Object} req
 * @param {Object} res
 */
const getAllSubjects = async (req, res) => {
    try {
        const courseId = req.query.course;
        let filter = {};
        if (courseId) {
            filter =  {course: courseId};
        }
        const subjects = await Subject.find(filter);
        res.json(subjects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

/**
 * get a single subject
 * @param {Object} req
 * @param {Object} res
 */
const getSubject = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id).populate('course', 'name');
        if (subject == null) {
            return res.status(404).json({ message: 'Cannot find subject' });
        }
        const exercises = await Exercise.find({ subject: subject._id });
        const response = {
            subject: subject,
            exercises: exercises
        }
        console.log("subject", response)
        res.json(response);

    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }

}
/**
 * update a single subject
 * @param {Object} req
 * @param {Object} res
 */
const updateSubject = async (req, res) => {

    try {
        const { name, course } = req.body;
        const id = req.params.id;
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
        res.json(subject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

/**
 * delete a single subject
 * @param {Object} req
 * @param {Object} res
 */
const deleteSubject = async (req, res) => {
    try {
        const cascade = req.query.cascade == 'true';
        const subject = await Subject.findById(req.params.id);
        if (subject == null) {
            return res.status(404).json({ message: 'Cannot find subject' });
        }
        if(cascade){
            console.log("cascade is true")
            // get all the exercises for this subject and the attempts for each exercise, then delete them
            const exercises = await Exercise.find({ subject: subject._id });
            const attempts = await Attempt.find({ exercise: { $in: exercises } });
            await Attempt.deleteMany({ _id: { $in: attempts } });
            await Exercise.deleteMany({ _id: { $in: exercises } });
        }
        else{
            // get all the exercises for this subject and set their subject to null
            const exercises = await Exercise.find({ subject: subject._id });
            for(const exercise of exercises){
                exercise.subject = null;
                await exercise.save();
            }
        }
        await Subject.deleteOne({ _id: req.params.id });
        res.json({ message: 'Subject deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}



export { createSubject, getAllSubjects, getSubject, updateSubject, deleteSubject };
