import { isValidObjectId } from '../../utils/helpers.js';
import userController from './userController.js';

/**
 * create a user 
 * @param {Object} req
 * @param {Object} res
 */
const createUser = async (req, res) => {
    try {
        const user = userController.createUser(req.body);
        if (user == null) {
            return res.status(400).json({ error: 'Error creating user' });
        }
        res.json({data:user});
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

/**
 * get all users
 * @param {Object} req
 * @param {Object} res
 */
const getAllUsers = async (req, res) => {
    try {
        const { query, limit,course } = req.query;
        const users = await userController.getAllUsers(query, limit,course);
        if(users.length==0){
            return res.status(404).json({ error: 'Cannot find users' });
        }
        res.json({data:users});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/**
 * get a single user
 * @param {Object} req
 * @param {Object} res
 */
const getUser = async (req, res) => {
    try {
        const id = isValidObjectId(req.params.id) ?  req.params.id : req.user.id;
        const user = await userController.getUser(id,false);
        if (user == null) {
            return res.status(404).json({ error: 'Cannot find user' });
        }
        res.json({data:user});
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message });
    }
}

/**
 * update a single user
 * @param {Object} req
 * @param {Object} res
 */
const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userController.updateUser(id, req.body);
        if (user == null) {
            return res.status(404).json({ error: 'Cannot find user' });
        }
        res.json({data:user});
    }
    catch (err) {
        console.error(err)
        res.status(400).json({ error: err.message });
    }
}

/**
 * delete a single user
 * @param {Object} req
 * @param {Object} res
 */
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userController.deleteUser(id);
        if (user == null) {
            return res.status(404).json({ error: 'Cannot find user' });
        }
        res.json({data:user});
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message });
    }
}

const getUsersByRole = async (req, res) => {
    try {
        const role = req.query.role || 'student';
        const limit = req.query.limit || 10;
        const query = req.query.query || '';
        const notCourse = req.query.not_course || null;
        const users = await userController.getUsersByRole(role, query, limit, notCourse);
        if(users.length==0){
            return res.status(404).json({ error: 'Cannot find users' });
        }
        res.json({data:users});
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message });
    }
}

export {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    getUsersByRole,
};
export default {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    getUsersByRole,
};