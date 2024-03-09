import exerciseController from './exerciseController.js';
import Anthropic from "@anthropic-ai/sdk";
import dotenv from 'dotenv';
dotenv.config();
console.log("process.env", process.env["ANTHROPIC_API_KEY"])
const anthropic = new Anthropic({
    apiKey: process.env["ANTHROPIC_API_KEY"]
});
const createExerciseText = async (req, res) => {
    try {
        const prompt = req.body.prompt
        const isTest = req.body.isTest
        console.log("prompt", prompt)
        console.log("isTest", isTest)
        let completePrompt = `Crea un ejercicio sobre ${prompt}. el ejercicio se debe poder testear mediante tests unitarios que haremos a continuación, para que el alumno sepa el resultado. Devuelve solo el enunciado. El enunciado debe ser en formato html directamente`
        if (isTest) {
            completePrompt = `Crea un test unitario para el ejercicio sobre ${prompt} usando jest. La respuesta debe ser sin formato,solo código`
        }
        const msg = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 2023,
            temperature: 1,
            messages: [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": completePrompt
                        }
                    ]
                }
            ]
        });
        res.json({ data: msg });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}
// Create a new exercise
const createExercise = async (req, res) => {
    try {
        const exercise = await exerciseController.createExercise(req.body, req.user.id);
        if (exercise == null) {
            return res.status(404).json({ error: 'Cannot create exercise' });
        }
        res.json({ data: exercise });
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
        res.json({ data: exercises });
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
        console.log("exercise", exercise)
        res.json({ data: exercise });
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
        res.json({ data: exercise });
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
export { createExerciseText, createExercise, getAllExercises, getExercise, updateExercise, deleteExercise };
