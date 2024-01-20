import { Router } from "express";
import { getAllExercises, getExercise, createExercise, updateExercise, deleteExercise } from "../controllers/exerciseController.js";
import { isAuth,isTeacher,isAdmin } from "../middleware/authMiddleware.js";
const router = Router();

router.get('/', getAllExercises);
router.post('/', isTeacher,createExercise);
router.get('/:id', getExercise, (req, res) => {
    res.json(res.exercise);
});
router.put('/:id', updateExercise);
router.delete('/:id',  deleteExercise);

export default router;