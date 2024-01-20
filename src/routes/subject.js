import { Router } from "express";

import { getAllSubjects, getSubject, createSubject, updateSubject, deleteSubject } from "../controllers/subjectController.js";

const router = Router();

router.get('/', getAllSubjects);

router.post('/', createSubject);

router.get('/:id', getSubject);

router.put('/:id', updateSubject);

router.delete('/:id', deleteSubject);

export default router;
