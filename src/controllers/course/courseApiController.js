import courseController from "./courseController.js";

// Crud for courses
/**
 * create a course
 * @param {Object} req
 * @param {Object} res
 */
const createCourse = async (req, res) => {
    try {
        const course = await courseController.createCourse(req.body);
        if (course == null) {
            return res.status(404).json({ error: 'Cannot create course' });
        }
        res.json({data:course});
    } catch (err) {
        res.status(400).json({ error: err.message });
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
        const query = req.query.query;
        if(role == 'student') {
            const courses = await courseController.getAllCourses(req.user.id,query);
            return res.json({data:courses});
        }
        const courses = await courseController.getAllCourses(null,query);
        console.log("courses", courses)
        res.json({data:courses});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/**
 * get a single course
 * @param {Object} req
 * @param {Object} res
 */
const getCourse = async (req, res) => {
    try {
        const id = req.params.id;
        const course = await courseController.getCourse(id);
        if (course == null) {
            return res.status(404).json({ error: 'Cannot find course' });
        }
        res.json({data:course});
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

/**
 * update a single course
 * @param {Object} req
 * @param {Object} res
 */
const updateCourse = async (req, res) => {

    try {
        const course = await courseController.updateCourse(req.params.id,req.body);
        if (course == null) {
            return res.status(404).json({ error: 'Cannot find course' });
        }
        res.json({data:course});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

/**
 * delete a single course
 * @param {Object} req
 * @param {Object} res
 */
const deleteCourse = async (req, res) => {
    try {
        const course = await courseController.deleteCourse(req.params.id);
        if (course == null) {
            return res.status(404).json({ error: 'Cannot find course' });
        }
        res.json({data:course});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

/**
 * add a teacher to a course
 * @param {Object} req
 * @param {Object} res
 */
const addTeacher = async (req, res) => {
    try {
        const courseId = req.params.id;
        const teacherId = req.body.teacher;
        const course = await courseController.addTeacher(courseId, teacherId);
        if (course == null) {
            return res.status(404).json({ error: 'Cannot find course' });
        }
        res.json({data:course});
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Error adding teacher" });
    }
}

/**
 * remove a teacher from a course
 * @param {Object} req
 * @param {Object} res
 */
const removeTeacher = async (req, res) => {
    try {
        const course = await courseController.removeTeacher(req.params.id, req.body.teacher);
        if (course == null) {
            return res.status(404).json({ error: 'Cannot find course' });
        }
        res.json({data:course});
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Error removing teacher" });
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
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await courseController.enrollStudent(courseId, studentId);
        if (user == null) {
            return res.status(404).json({ error: 'Cannot find user' });
        }
        res.json({data:user});
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message });
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
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const user = await courseController.unenrollStudent(courseId, studentId);
        if (user == null) {
            return res.status(404).json({ error: 'Cannot find user' });
        }
        res.json({data:user});
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message });
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