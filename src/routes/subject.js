import { Router } from "express";

import { getAllSubjects, getSubject, createSubject, updateSubject, deleteSubject, copySubject } from "../controllers/subject/subjectApiController.js";

const router = Router();

router.get('/', getAllSubjects);

router.post('/', createSubject);

router.get('/:id', getSubject);

router.put('/:id', updateSubject);

router.post('/:id/copy', copySubject);

router.delete('/:id', deleteSubject);



export default router;
