import User from '../../models/userModel.js';
import Attempt from '../../models/attemptModel.js';
import Exercise from '../../models/exerciseModel.js';
import { isValidObjectId } from '../../utils/helpers.js';
import { getCourse, } from '../course/courseController.js';
import { getAllSubjects, getSubject } from '../subject/subjectController.js';
import { getAllExercises } from '../exercise/exerciseController.js';
import { getExercise } from '../exercise/exerciseController.js';
/**
 * create a user, returns the created user or null if there was an error
 * @param {Object} data
 * @returns {Object} user 
 */
const createUser = async (data) => {
    try {
        const user = new User(data);
        await user.save();
        return user;
    } catch (err) {
        console.error("error", err)
        return null;
    }
}
/**
 * get all users
 * @param {string} query
 * @param {number} limit
 * @returns {Array} users
 */
const getAllUsers = async (query, limit, course = null) => {
    try {
        let filter = {};
        if (query) {
            filter = {
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } },
                ],
            };
        }
        if (isValidObjectId(course)) {
            filter.courses = { $eq: course };
        }
        let users = [];
        if (limit) {
            users = await User.find(filter).limit(parseInt(limit));
        }
        else {
            users = await User.find(filter);
        }
        if (course) {
            users = await Promise.all(users.map(async (user) => {
                const userData = user._doc;
                delete userData.password;
                // filter attempts by user
                let attempts = await getAttemptsByCourse(user._id);
                return { ...userData, attempts };
            }));
        }
        return users;
    }
    catch (err) {
        console.error(err)
        return [];
    }
}

const getAttemptsByExercise = async (userId) => {
    const attempts = await Attempt.find({ createdBy: userId }).sort({ createdAt: -1 });
    const attemptsByExercise = {};
    attempts.forEach(attempt => {
        if (!attemptsByExercise[attempt.exercise]) {
            attemptsByExercise[attempt.exercise] = {
                exercise: attempt.exercise,
                attempts: [],
                correct: 0,
                total: 0,
                isCorrect: attempt.success,
                bestAttempt: attempt
            }
        }
        if (attempt.correct_tests > attemptsByExercise[attempt.exercise].correct) {
            attemptsByExercise[attempt.exercise].correct = attempt.correct_tests;
        }
        if (attemptsByExercise[attempt.exercise].total == 0) {
            attemptsByExercise[attempt.exercise].total = attempt.total_tests;
        }
        if (!attemptsByExercise[attempt.exercise].isCorrect) {
            attemptsByExercise[attempt.exercise].isCorrect = attempt.success;
        }
        if (attemptsByExercise[attempt.exercise].bestAttempt.correct_percentage < attempt.correct_percentage) {
            attemptsByExercise[attempt.exercise].bestAttempt = attempt;
        }
        attemptsByExercise[attempt.exercise].attempts.push(attempt);

    });
    return attemptsByExercise;
}

const getAttemptsBySubject = async (userId) => {
    const attemptsByExercise = await getAttemptsByExercise(userId);
    const attemptsBySubject = {};
    for (const [key, exerciseAttempt] of Object.entries(attemptsByExercise)) {
        const exercise = await getExercise(exerciseAttempt.exercise);
        if (!exercise) {
            continue;
        }
        const subject = await getSubject(exercise.subject);
        const subjectExercises = await getAllExercises(subject._id);
        if (!subject) {
            continue;
        }
        if (!attemptsBySubject[subject._id]) {
            attemptsBySubject[subject._id] = {
                subject: subject._id,
                total: subjectExercises.length,
                correct: 0,
                exercises: []
            }
        }
        attemptsBySubject[subject._id].exercises.push(exerciseAttempt);
        if (exerciseAttempt.isCorrect) {
            attemptsBySubject[subject._id].correct++;
        }
    }
    return attemptsBySubject;
}
const getAttemptsByCourse = async (userId) => {
    const attemptsBySubject = await getAttemptsBySubject(userId);
    const attemptsByCourse = [];
    for (const [key, subjectAttempt] of Object.entries(attemptsBySubject)) {
        const subject = await getSubject(subjectAttempt.subject);
        subject.course = subject.course._id;
        if (!subject) {
            continue;
        }
        if (!attemptsByCourse.find(course => course.course == subject.course)) {
            const subjects = await getAllSubjects(subject.course);
            attemptsByCourse.push({
                course: subject.course,
                total: subjects.length,
                correct: 0,
                subjects: []
            });
        }
        attemptsByCourse.find(course => course.course == subject.course).subjects.push(subjectAttempt);
        attemptsByCourse.find(course => course.course == subject.course).correct += subjectAttempt.correct / subjectAttempt.total;

    }
    return attemptsByCourse;
}
/**
 * get a single user
 * @param {String} id
 * @returns {Object} user
 */

const getUser = async (id, simple = true) => {
    try {
        const user = await User.findById(id)
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' });
        }
        if (simple) {
            return user;
        }
        const completeCourses = await Promise.all(user.courses.map(async (courseId) => {
            const course = await getCourse(courseId);
            return course;
        }));
        const attempts = await getAttemptsByCourse(user._id);
        const userData = user._doc;
        delete userData.password;
        userData.courses = completeCourses;
        userData.attempts = attempts;
        return userData;
    }
    catch (err) {
        console.error(err)
        return null;
    }
}

/**
 * update a single user
 * @param {String} id
 * @param {Object} data
 */
const updateUser = async (id, data) => {
    try {
        const { name, password, role } = data;
        const user = await User.findById(id);
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' });
        }
        if (name) {
            user.name = name;
        }
        if (password) {
            user.password = password;
        }
        if (role) {
            user.role = role;
        }
        await user.save();
        return user;
    }
    catch (err) {
        console.error(err)
        return null;
    }
}

/**
 * delete a single user
 * @param {String} id
 * @returns {Object} user
 */
const deleteUser = async (id) => {
    try {
        const user = await User.findById(id);
        if (user == null) {
            return null;
        }
        await User.findByIdAndDelete(id);
        return user;

    }
    catch (err) {
        return null;
    }
}

/**
 * get all teachers and admins(optional). Limit to "limit" variable, default 10. Skip users that are already teachers of the course 'notCourse'
 * @param {String} query
 * @param {Number} limit
 * @param {String} notCourse
 * @param {Boolean} includeAdmins
 * @returns {Array} teachers
 */
const getTeachers = async (query = "", limit = 20, notCourse = null, includeAdmins) => {
    try {
        let skip_users = [];
        // if course is a valid id, skip users that are already teachers of the course
        if (isValidObjectId(notCourse)) {
            const course_obj = await getCourse(notCourse);
            skip_users = course_obj.teachers;
        }
        // if includeAdmins is true, include admins in the search
        let roleFilter = { role: 'teacher' };
        if (includeAdmins) {
            roleFilter = {
                $or: [
                    { role: 'teacher' },
                    { role: 'admin' }
                ],
            }
        }
        const teachers = await User.find(
            {

                $and: [
                    {
                        _id: { $nin: skip_users }
                    },
                    roleFilter,
                    {
                        $or: [
                            { name: { $regex: query, $options: 'i' } },
                            { email: { $regex: query, $options: 'i' } },
                        ],
                    },

                ],
            }

        ).sort({ name: 1, email: 1 }).limit(parseInt(limit));
        return teachers;
    } catch (err) {
        console.error(err)
        return [];
    }
}
/** */
const getUsersByRole = async (role, query = "", limit = 20, notCourse = null) => {
    try {

        let skip_users = [];
        // if course is a valid id, skip users that are already teachers of the course
        if (isValidObjectId(notCourse)) {
            const notCourse_obj = await getCourse(notCourse);
            skip_users = notCourse_obj.teachers;
        }
        let users = [];
        let filter = {
            $and: [
                { role: role },
                {
                    $or: [
                        { name: { $regex: query, $options: 'i' } },
                        { email: { $regex: query, $options: 'i' } },
                    ],
                },
            ],
        }
        if (notCourse) {

            if (role != 'student') {
                filter._id = { $nin: skip_users };
            }
            else {
                filter.courses = { $ne: notCourse };
            }
        }
        users = await User.find(filter).sort({ name: 1, email: 1 }).limit(parseInt(limit));
        return users;
    } catch (err) {
        console.error(err)
        return [];
    }
}
export {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    getUsersByRole,
};
export default {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    getUsersByRole,
};