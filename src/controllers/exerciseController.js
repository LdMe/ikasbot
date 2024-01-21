
import Exercise from '../models/exerciseModel.js';
import Attempt from '../models/attemptModel.js';

// Create a new exercise
const createExercise = async (req, res) => {
    try {
        const exercise = new Exercise(req.body);
        const user = req.user;
        exercise.createdBy = user.id;
        await exercise.save();
        res.status(201).json(exercise);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all exercises
const getAllExercises = async (req, res) => {
    try {
        const exercises = await Exercise.find().populate('createdBy', 'name email');
        res.json(exercises);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single exercise
const getExercise = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id).populate('createdBy', 'name email').populate('subject');
        if (exercise == null) {
            return res.status(404).json({ message: 'Cannot find exercise' });
        }
        res.json(exercise);

    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }

};

// Update a single exercise
const updateExercise = async (req, res) => {

    try {
        const userId = req.user.id;
    
        const { name, description, test,level} = req.body;
        const id = req.params.id;
        const exercise = await Exercise.findById(id);
        if (exercise == null) {
            return res.status(404).json({ message: 'Cannot find exercise' });
        }
        
        exercise.name = name;
        exercise.description = description;
        exercise.test = test;
        exercise.level = level;
        await exercise.save();
        res.json(exercise);

    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Delete a single exercise
const deleteExercise = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (exercise == null) {
            return res.status(404).json({ message: 'Cannot find exercise' });
        }
        if (exercise.createdBy != req.user.id && req.user.role != 'admin') {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const attempts = await Attempt.deleteMany({ exercise: exercise._id });

        await Exercise.findByIdAndDelete(req.params.id);
        res.json({ message: 'Exercise deleted' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Export the functions
export { createExercise, getAllExercises, getExercise, updateExercise, deleteExercise };
