import {Router} from 'express';
import {isAuth,isAdmin} from '../middleware/authMiddleware.js';
import {getAllUsers, getUser, updateUser,deleteUser, createUser,getUsersByRole} from '../controllers/user/userApiController.js';
import { get } from 'mongoose';
const router = Router();

router.get('/', getAllUsers);
router.get('/by_role', getUsersByRole);

router.get('/profile',isAuth,getUser);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/', createUser);



export default router;
