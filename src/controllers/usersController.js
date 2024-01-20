import User from '../models/userModel.js';
import Course from '../models/courseModel.js';
import bcrypt from 'bcryptjs';
import Attempt from '../models/attemptModel.js';
/**
 * create a user with username and password
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
        const users = await User.find();
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
        const user = await User.findById(req.params.id).populate('courses');
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' });
        }
        const attempts = await Attempt.find({ createdBy: user._id }).sort({ createdAt: -1 }).populate('exercise');
        const response ={...user._doc,attempts:attempts};
        res.json(response);
    }
    catch (err) {
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
        const { username, password, role } = req.body;
        const id = req.params.id;
        const user = await User.findById(id);
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' });
        }
        user.username = username;
        user.password = password;
        user.role = role;
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
                            { username: { $regex: query, $options: 'i' } },
                            { email: { $regex: query, $options: 'i' } },
                        ],
                    },

                ],
            }

        ).sort({ username: 1, email: 1 }).limit(parseInt(limit));
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
                        { username: { $regex: query, $options: 'i' } },
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
         users = await User.find(filter).sort({ username: 1, email: 1 }).limit(parseInt(limit));

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