import subjectController from "./subjectController.js";

/**
 * create a subject
 * @param {Object} req
 * @param {Object} res
 */
const createSubject = async (req, res) => {
    try {
        const subject = await subjectController.createSubject(req.body);
        if (subject == null) {
            return res.status(404).json({ error: 'Cannot create subject' });
        }
        res.json({data:subject})
    } catch (err) {
        console.error(err)
        res.status(400).json({ error: err.message });
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
        const subjects = await subjectController.getAllSubjects(courseId);
        if(subjects.length==0){
            return res.status(404).json({ error: 'Cannot find subjects' });
        }
        res.json({data:subjects});
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

/**
 * get a single subject
 * @param {Object} req
 * @param {Object} res
 */
const getSubject = async (req, res) => {
    try {
        const isdminOrTeacher = req.user.role === 'admin' || req.user.role === 'teacher';
        const subject = await subjectController.getSubject(req.params.id, isdminOrTeacher);
        if (subject == null) {
            return res.status(404).json({ error: 'Cannot find subject' });
        }
        res.json({data:subject});
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

/**
 * update a single subject
 * @param {Object} req
 * @param {Object} res
 */
const updateSubject = async (req, res) => {

    try {
        const subject = await subjectController.updateSubject(req.params.id, req.body);
        if (subject == null) {
            return res.status(404).json({ error: 'Cannot find subject' });
        }
        res.json({data:subject});
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}

/**
 * delete a single subject
 * @param {Object} req
 * @param {Object} res
 */
const deleteSubject = async (req, res) => {
    try {
        const subject = await subjectController.deleteSubject(req.params.id);
        if (subject == null) {
            return res.status(404).json({ error: 'Cannot find subject' });
        }
        res.json({data:subject});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

export { createSubject, getAllSubjects, getSubject, updateSubject, deleteSubject };
