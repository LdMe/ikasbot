import { resaveAttempts,getAttempt } from "../controllers/attempt/attemptController.js";
import { Router } from "express";
import {isAuth} from '../middleware/authMiddleware.js';

const router = Router();

//router.post("/resave",isAuth, resaveAttempts);
router.get("/:id", (req, res) => {
    const id = req.params.id;
    getAttempt(id).then((attempt) => {
        res.json({data:attempt});
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    });
});

export default router