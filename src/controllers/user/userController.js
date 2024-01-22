import User from '../../models/userModel.js';
import Course from '../../models/courseModel.js';
import bcrypt from 'bcryptjs';
import Attempt from '../../models/attemptModel.js';
import Subject from '../../models/subjectModel.js';
import Exercise from '../../models/exerciseModel.js';
import { isValidObjectId } from '../../utils/helpers.js';
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
const getAllUsers = async (query, limit) => {
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
        if (limit) {
            const users = await User.find(filter).limit(parseInt(limit));
            return users;
        }
        const users = await User.find(filter);
        return users;
    }
    catch (err) {
        console.error(err)
        return [];
    }
}

/**
 * get a single user
 * @param {String} id
 * @returns {Object} user
 */

const getUser = async (id) => {
    try {  
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
        return response;
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
const updateUser = async (id,data) => {
    try {
        const { name, password, role } = data;
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
const getTeachers = async (query="",limit=20,notCourse=null,includeAdmins) => {
    try {
        let skip_users = [];
        console.log("course", notCourse)
        // if course is a valid id, skip users that are already teachers of the course
        if (isValidObjectId(notCourse)) {
            const course_obj = await Course.findById(notCourse);
            skip_users = course_obj.teachers;
            console.log("skip_users", skip_users)
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
const getUsersByRole = async (role,query="",limit=20,notCourse=null,includeAdmins=false) => {
    console.log(`getUsersByRole role:${role}, query:${query}, limit:${limit}, notCourse:${notCourse}, includeAdmins:${includeAdmins}`)
    try {
        
        let skip_users = [];
        // if course is a valid id, skip users that are already teachers of the course
        if (isValidObjectId(notCourse)) {
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