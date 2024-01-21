import Course from "../models/courseModel.js";
import User from "../models/userModel.js";
import Subject from "../models/subjectModel.js";

// Crud for courses
/**
 * create a course
 * @param {Object} req
 * @param {Object} res
 */
const createCourse = async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json(course);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

/**
 * get all courses
 * @param {Object} req
 * @param {Object} res
 */
const getAllCourses = async (req, res) => {
    try {
        const role = req.user.role;
        let filter = {};
        let courses = [];
        if (role == 'student') {
            const user = await User.findById(req.user.id).populate('courses');
            courses = user.courses;
        }
        else if(role == 'teacher'){
            courses = await Course.find({teachers: req.user.id});
        }
        else{
            courses = await Course.find();
        }
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

/**
 * get a single course
 * @param {Object} req
 * @param {Object} res
 */
const getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('teachers');
        if (course == null) {
            return res.status(404).json({ message: 'Cannot find course' });
        }
        const subjects = await Subject.find({ course: course._id });
        let students = [];
        console.log("req.user", req.user)
        if (req.user.role != 'student') {
            // find students where courses contains course._id
            students = await User.find({ courses: course._id });
        }
        const response = {
            course,
            subjects,
            students
        }
        res.json(response);

    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }

}

/**
 * update a single course
 * @param {Object} req
 * @param {Object} res
 */
const updateCourse = async (req, res) => {

    try {
        const { name, year, month, branch } = req.body;
        const id = req.params.id;
        const course = await Course.findById(id);
        if (course == null) {
            return res.status(404).json({ message: 'Cannot find course' });
        }
        if (name != null) {
            course.name = name;
        }
        if (year != null) {
            course.year = year;
        }
        if (month != null) {
            course.month = month;
        }
        if (branch != null) {
            course.branch = branch;
        }
        await course.save();
        res.json(course);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

/**
 * delete a single course
 * @param {Object} req
 * @param {Object} res
 */
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course == null) {
            return res.status(404).json({ message: 'Cannot find course' });
        }
        // delete course from students and subjects
        const students = await User.find({ courses: course._id });
        students.forEach(async (student) => {
            student.courses.pull(course._id);
            await student.save();
        });
        const subjects = await Subject.find({ course: course._id });
        subjects.forEach(async (subject) => {
            subject.course = null;
            await subject.save();
        });

        await Course.deleteOne({ _id: course._id });
        res.json({ message: 'Course deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

/**
 * add a teacher to a course
 * @param {Object} req
 * @param {Object} res
 */
const addTeacher = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('teachers');
        console.log("course", course)
        if (course == null) {
            return res.status(404).json({ message: 'Cannot find course' });
        }
        const teacher = await User.findById(req.body.teacher);
        if (teacher == null) {
            return res.status(404).json({ message: 'Cannot find teacher' });
        }
        if (teacher.role != 'teacher' && teacher.role != 'admin') {
            return res.status(400).json({ message: 'User is not a teacher nor admin' });
        }
        if (course.teachers.some(t => t._id.equals(teacher._id))) {
            return res.status(400).json({ message: 'Teacher already added' });
        }
        course.teachers.push(teacher);
        await course.save();
        res.json(course);
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error adding teacher" });
    }
}

/**
 * remove a teacher from a course
 * @param {Object} req
 * @param {Object} res
 */
const removeTeacher = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course == null) {
            return res.status(404).json({ message: 'Cannot find course' });
        }
        const teacher = req.body.teacher;
        course.teachers.pull(teacher);
        await course.save();
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
/**
 * enroll a student in a course
 * @param {Object} req
 * @param {Object} res
 */
const enrollStudent = async (req, res) => {
    try {
        let courseId  = req.params.id;
        let studentId  = req.body.student;
        const userId = req.user.id;
        const role = req.user.role;
        if (!studentId) {
            studentId = userId;
        }
        if (userId != studentId && role != 'admin' && role != 'teacher') {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await User.findById(studentId);
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' });
        }
        const course = await Course.findById(courseId);
        if (course == null) {
            return res.status(404).json({ message: 'Cannot find course' });
        }
        /* if (user.role != 'student') {
            return res.status(401).json({ message: 'Unauthorized' });
        } */
        if (user.courses.includes(courseId)) {
            return res.status(400).json({ message: 'User already enrolled in this course' });
        }
        user.courses.push(courseId);
        await user.save();
        res.json(user);

    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
}

/**
 * unenroll a student from a course
 * @param {Object} req
 * @param {Object} res
 */
const unenrollStudent = async (req, res) => {
    try {
        let courseId  = req.params.id;
        let studentId  = req.body.student;
        const userId = req.user.id;
        const role = req.user.role;
        if (!studentId) {
            studentId = userId;
        }
        if (userId != studentId && role != 'admin' && role != 'teacher') {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await User.findById(studentId);
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' });
        }
        const course = await Course.findById(courseId);
        if (course == null) {
            return res.status(404).json({ message: 'Cannot find course' });
        }
        /* if (user.role != 'student') {
            return res.status(401).json({ message: 'Unauthorized' });
        } */
        user.courses.pull(courseId);
        await user.save();
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export {
    createCourse,
    getAllCourses,
    getCourse,
    updateCourse,
    deleteCourse,
    addTeacher,
    removeTeacher,
    enrollStudent,
    unenrollStudent
};