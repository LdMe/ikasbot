import { Router } from "express";
import exercisesRouter from './exercise.js';
import testRouter from './test.js';
import userRouter from './user.js';
import authRouter from './auth.js';
import courseRouter from './course.js';
import subjectRouter from './subject.js';


import {isAuth, isAdmin} from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.use('/exercise',isAuth, exercisesRouter);
router.use('/test',isAuth, testRouter);
router.use('/user',isAuth, userRouter);
router.use('/auth', authRouter);
router.use('/course',isAuth, courseRouter);
router.use('/subject',isAuth, subjectRouter);
export default router;