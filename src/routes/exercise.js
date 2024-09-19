import { Router } from "express";
import { getAllExercises, getExercise, createExercise, updateExercise, deleteExercise,createExerciseText, copyExercise } from "../controllers/exercise/exerciseApiController.js";
import { isAuth,isTeacher,isAdmin } from "../middleware/authMiddleware.js";
const router = Router();
router.post('/prompt',isAdmin,createExerciseText)
router.get('/', getAllExercises);
router.post('/', isTeacher,createExercise);
router.get('/:id', getExercise, getExercise);
router.put('/:id', updateExercise);
router.delete('/:id',  deleteExercise);
router.post('/:id/copy', isAdmin, copyExercise);

export default router;