import {Router} from 'express';
import {testCode} from '../controllers/testController.js';

const router = Router();

router.post('/', async(req,res)=>{
    const exerciseId = req.body.id;
    const code = req.body.code;

    try{
        const userId = req.user.id;
        const result = await testCode(userId,exerciseId,code);
        res.status(200).json(result);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
});

export default router;
