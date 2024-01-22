import { Router } from "express";
import { getAllCourses, getCourse, createCourse, updateCourse, deleteCourse,addTeacher,removeTeacher,enrollStudent,unenrollStudent } from "../controllers/course/courseApiController.js";

import { isAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get('/', getAllCourses);
router.post('/', createCourse);
router.get('/:id', getCourse, (req, res) => {
    res.json(res.course);
});
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);
router.post('/:id/teacher',addTeacher);
router.delete('/:id/teacher',removeTeacher);
router.post('/:id/enroll',isAuth,enrollStudent);
router.delete('/:id/enroll',isAuth,unenrollStudent);

export default router;
