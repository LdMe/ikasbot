import { resaveAttempts } from "../controllers/attempt/attemptController.js";
import { Router } from "express";
import {isAuth} from '../middleware/authMiddleware.js';

const router = Router();

router.post("/resave",isAuth, resaveAttempts);

export default router