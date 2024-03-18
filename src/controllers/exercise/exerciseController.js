import Exercise from '../../models/exerciseModel.js';
import Attempt from '../../models/attemptModel.js';

/**
 *  Create a new exercise
 * @param {Object} data
 * @param {String} createdBy
 * @returns {Object} exercise
 */
const createExercise = async (data,createdBy) => {
    try {
        const exercise = new Exercise(data);
        exercise.createdBy = createdBy;
        await exercise.save();
        return exercise;
    } catch (err) {
        console.error(err);
        return null;
    }
};

/**
 * Get all exercises
 * @returns {Array} exercises
 */
const getAllExercises = async (subject=null,avoidDraft=true) => {
    try {
        let filter = {};
        if(subject){
            filter = {subject};
        }
        if(avoidDraft){
            
            // oly if isDrft is not true (false or undefined)
            filter.isDraft = {$ne:true};
        }
        // if subject is an array, get exercises for each subject
        if(Array.isArray(subject)){
            filter = {subject:{$in:subject}};
        }
        const exercises = await Exercise.find(filter).populate('createdBy', 'name email');
        return exercises;
    } catch (err) {
        console.error(err);
        return [];
    }
};

/**
 * Get a single exercise
 * @param {String} id
 * @returns {Object} exercise
 */
const getExercise = async (id) => {
    try {
        const exercise = await Exercise.findById(id).populate('createdBy', 'name email').populate('subject');
        if (exercise == null) {
            return null;
        }
        return exercise;
    }
    catch (err) {
        console.error(err);
        return null;
    }

};

/**
 * Update a single exercise
 * @param {String} id
 * @param {Object} data
 * @returns {Object} exercise
 */
const updateExercise = async (id, data) => {
    try {
        const { name, description, test,level,isDraft} = data;
        const exercise = await Exercise.findById(id);
        if (exercise == null) {
            return null;
        }
        exercise.name = name;
        exercise.description = description;
        exercise.test = test;
        exercise.level = level;
        exercise.isDraft = isDraft;
        await exercise.save();
        await exercise.populate('subject')
        return exercise;

    }
    catch (err) {
        console.error(err);
        return null;
    }
};

/**
 * Delete a single exercise
 * @param {String} id
 * @returns {Object} exercise
 */
const deleteExercise = async (id) => {
    try {
        const exercise = await Exercise.findById(id);
        if (exercise == null) {
            return null;
        }
        const attempts = await Attempt.deleteMany({ exercise: exercise._id });
        await Exercise.findByIdAndDelete(id);
        return exercise;
    }
    catch (err) {
        console.error(err);
        return null;
    }
};

/**
 * Delete all exercises for a subject
 * @param {String} subject
 * @returns {Array} exercises
 */
const deleteExercises = async (subject) => {
    try {
        const exercises = await Exercise.find({subject});
        for(const exercise of exercises){
            await deleteExercise(exercise._id);
        }
        return exercises;
    }
    catch (err) {
        console.error(err);
        return [];
    }
}

// Export the functions
export { createExercise, getAllExercises, getExercise, updateExercise, deleteExercise,deleteExercises };
export default { createExercise, getAllExercises, getExercise, updateExercise, deleteExercise, deleteExercises};
