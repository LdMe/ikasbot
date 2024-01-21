import User from '../models/userModel.js';
import Course from '../models/courseModel.js';
import bcrypt from 'bcryptjs';
import Attempt from '../models/attemptModel.js';
import Subject from '../models/subjectModel.js';
import Exercise from '../models/exerciseModel.js';
import { isValidObjectId } from '../utils/helpers.js';
/**
 * create a user 
 * @param {Object} req
 * @param {Object} res
 */

const createUser = async (req, res) => {
    try {
        console.log("createUser")
        console.log(req.body)
        const user = new User(req.body);
        console.log("user", user)
        user.password = await bcrypt.hash(user.password, 10);

        console.log("user created", user)
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        console.log("error", err)
        res.status(400).json({ message: err.message });
    }
}

/**
 * get all users
 * @param {Object} req
 * @param {Object} res
 */
const getAllUsers = async (req, res) => {
    try {
        const { query, limit } = req.query;
        console.log("query", query)
        console.log("limit", limit)

        let filter = {};
        if (query) {
            filter = {
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } },
                ],
            };
        }
        
        
        if(limit){
            const users = await User.find(filter).limit(parseInt(limit));
            console.log("users",users)
            return res.json(users);
        }
        const users = await User.find(filter);
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

/**
 * get a single user
 * @param {Object} req
 * @param {Object} res
 */
const getUser = async (req, res) => {
    try {
        const id = isValidObjectId(req.params.id) ?  req.params.id : req.user.id;
        const user = await User.findById(id).populate('courses');
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' });
        }
        const attempts = await Attempt.find({ createdBy: user._id }).sort({ createdAt: -1 }).populate('exercise');
        const attemptsByExercise = {};
        attempts.forEach(attempt => {
            if (!attemptsByExercise[attempt.exercise._id]) {
                attemptsByExercise[attempt.exercise._id] = {
                    exercise: attempt.exercise,
                    attempts: [],
                    isCorrect: attempt.success,
                    bestAttempt: attempt
                }
            }
            if (!attemptsByExercise[attempt.exercise._id].isCorrect) {
                attemptsByExercise[attempt.exercise._id].isCorrect = attempt.success;
            }
            if (attemptsByExercise[attempt.exercise._id].bestAttempt.correct_percentage < attempt.correct_percentage) {
                attemptsByExercise[attempt.exercise._id].bestAttempt = attempt;
            }
            attemptsByExercise[attempt.exercise._id].attempts.push(attempt);
        });
        // once grouped by exercise, group exercises by subject and subject by course
        const courses = [];
        const formattedCourses = user.courses.map(course => course._doc);
        for( const course of formattedCourses){
           
            courses.push(course);
            // find subjects and convert them to regular objects
            const subjects = await Subject.find({ course: course._id });
            const formattedSubjects = subjects.map(subject => subject._doc);
            for( const subject of formattedSubjects){
                const exercises = await Exercise.find({subject:subject._id});
                const formattedExercises = exercises.map(exercise => exercise._doc);
                course.subjects = course.subjects || [];
                course.subjects.push(subject);
                for (const exercise of formattedExercises){
                    subject.exercises = subject.exercises || [];
                    if(attemptsByExercise[exercise._id]){
                        subject.exercises.push(attemptsByExercise[exercise._id]);
                    }
                    else{
                        subject.exercises.push({exercise:exercise,attempts:[]});
                    }
                }
            };
        };
        const userData = user._doc;
        delete userData.password;
        const response ={...userData,attempts:attemptsByExercise,courses};
        res.json(response);

    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }

}

/**
 * update a single user
 * @param {Object} req
 * @param {Object} res
 */
const updateUser = async (req, res) => {

    try {
        const { name, password, role } = req.body;
        const id = req.params.id;
        const user = await User.findById(id);
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' });
        }
        if(name){
            user.name = name;
        }
        if(password){
            user.password = await bcrypt.hash(password, 10);
        }
        if(role){
            user.role = role;
        }
        await user.save();
        res.json(user);

    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }

}

/**
 * delete a single user
 * @param {Object} req
 * @param {Object} res
 */
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' });
        }
        await user.remove();
        res.json({ message: 'Deleted user' });

    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}


/**
 * get all teachers and admins(optional). Limit to "limit" variable, default 10
 * @param {Object} req
 * @param {Object} res
 */
const getTeachers = async (req, res) => {
    console.log("getTeachers")
    try {
        const query = req.query.query || '';
        const limit = req.query.limit || 10;
        const course = req.query.course || '';
        console.log("query", query)
        console.log("limit", limit)
        let skip_users = [];
        console.log("course", course)
        // if course is a valid id, skip users that are already teachers of the course
        if (course.match(/^[0-9a-fA-F]{24}$/)) {
            const course_obj = await Course.findById(course);
            skip_users = course_obj.teachers;
            console.log("skip_users", skip_users)
        }
        const teachers = await User.find(
            {
                _id: { $nin: skip_users },
                $and: [

                    {
                        $or: [
                            { role: 'teacher' },
                            { role: 'admin' }
                        ],
                    },
                    {
                        $or: [
                            { name: { $regex: query, $options: 'i' } },
                            { email: { $regex: query, $options: 'i' } },
                        ],
                    },

                ],
            }

        ).sort({ name: 1, email: 1 }).limit(parseInt(limit));
        res.json(teachers);
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
}

const getUsersByRole = async (req, res) => {
    console.log("getUsersByRole")
    try {
        const role = req.query.role || 'student';
        const limit = req.query.limit || 10;
        const query = req.query.query || '';
        const notCourse = req.query.not_course || null;
        let skip_users = [];
        // if course is a valid id, skip users that are already teachers of the course
        if (notCourse.match(/^[0-9a-fA-F]{24}$/)) {
            const notCourse_obj = await Course.findById(notCourse);
            skip_users = notCourse_obj.teachers;
            console.log("skip_users", skip_users)
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
            
            if (role == 'teacher') {
                filter._id = { $nin: skip_users };
            }
            else {
                filter.courses = { $ne: notCourse };
            }
        }
         users = await User.find(filter).sort({ name: 1, email: 1 }).limit(parseInt(limit));

        res.json(users);
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
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