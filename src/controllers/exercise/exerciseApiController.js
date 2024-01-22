import exerciseController from './exerciseController.js';

// Create a new exercise
const createExercise = async (req, res) => {
    try {
        const exercise = await exerciseController.createExercise(req.body, req.user.id);
        if (exercise == null) {
            return res.status(404).json({ error: 'Cannot create exercise' });
        }
        res.json({data:exercise});
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }

};

// Get all exercises
const getAllExercises = async (req, res) => {
    try {
        const exercises = await exerciseController.getAllExercises();
        if (exercises.length == 0) {
            return res.status(404).json({ error: 'Cannot find exercises' });
        }
        res.json({data:exercises});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// Get a single exercise
const getExercise = async (req, res) => {
    try {
        const exercise = await exerciseController.getExercise(req.params.id);
        if (exercise == null) {
            return res.status(404).json({ error: 'Cannot find exercise' });
        }
        console.log("exercise",exercise)
        res.json({data:exercise});
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// Update a single exercise
const updateExercise = async (req, res) => {
    try {
        const exercise = await exerciseController.updateExercise(req.params.id, req.body);
        if (exercise == null) {
            return res.status(404).json({ error: 'Cannot find exercise' });
        }
        res.json({data:exercise});
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// Delete a single exercise
const deleteExercise = async (req, res) => {
    try {
        const exercise = await exerciseController.deleteExercise(req.params.id);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// Export the functions
export { createExercise, getAllExercises, getExercise, updateExercise, deleteExercise };
