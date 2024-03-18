import exerciseController from './exerciseController.js';
import Anthropic from "@anthropic-ai/sdk";
import dotenv from 'dotenv';
dotenv.config();
const anthropic = new Anthropic({
    apiKey: process.env["ANTHROPIC_API_KEY"]
});
const createExerciseText = async (req, res) => {
    try {
        const prompt = req.body.prompt
        const isTest = req.body.isTest
        let completePrompt = `Crea un ejercicio sobre ${prompt}. El código debe ser en javascript. El ejercicio se debe poder testear mediante tests unitarios que haremos a continuación, para que el alumno sepa el resultado. Devuelve solo el enunciado. El enunciado debe ser en formato html directamente. El enunciado debe tener un título ingenioso y dejar muy claro las variables o funciones que se deben crear. A ser posible, el ejercicio debe hacer referencia a un tema de actualidad o de interés general, o a alguna situación graciosa de la vida real. Devuelve únicamente el enunciado.`
        if (isTest) {
            completePrompt = `Crea tests unitarios para el ejercicio sobre ${prompt} usando jest. La respuesta debe ser sin formato y sin la solución, solo los tests unitarios.`
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
        if(req.user.role != "admin"){
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const exercise = await exerciseController.deleteExercise(req.params.id);
        res.json({ data: exercise });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// Export the functions
export { createExerciseText, createExercise, getAllExercises, getExercise, updateExercise, deleteExercise };
