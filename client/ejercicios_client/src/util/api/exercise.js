import { fetchApi } from "../helpers";

const getExercises = async () => {
    try {
        const url = `/exercise`;
        return await fetchApi(url, "GET");
    }
    catch (err) {
        console.error(err);
        return { error: err.message };
    }
}

const getExercise = async (id) => {
    try {
        const url = `/exercise/${id}`;
        return await fetchApi(url, "GET");
    }
    catch (err) {
        console.error(err);
        return { error: err.message };
    }
}

const createExercise = async (data) => {
    try {
        const url = `/exercise`;
        return await fetchApi(url, "POST", data);
    }
    catch (error) {
        console.error(error)
        return { error: error.message };
    }
}

const updateExercise = async (id, data) => {
    try {
        const url = `/exercise/${id}`;
        return await fetchApi(url, "PUT", data);
    }
    catch (error) {
        console.error(error)
        return { error: error.message };
    }
}

const deleteExercise = async (id) => {
    try {
        const url = `/exercise/${id}`;
        return await fetchApi(url, "DELETE");
    }
    catch (error) {
        console.error(error)
        return { error: error.message };
    }
}
const createAttempt = async (exerciseId, code) => {
    try {
        const url = `/test`;
        return await fetchApi(url, "POST", { code: code , id: exerciseId});
    }
    catch (error) {
        console.error(error)
        return { error: error.message };
    }
}

const createExerciseText = async (prompt,isTest=false) => {
    try {
        const url = `/exercise/prompt`;
        return await fetchApi(url, "POST", {prompt,isTest});
    }
    catch (error) {
        console.error(error)
        return { error: error.message };
    }
}

const copyExercise = async (id, newSubject) => {
    try {
        const url = `/exercise/${id}/copy`;
        return await fetchApi(url,"POST",{subject:newSubject});
    }
    catch (error) {
        console.error(error)
        return { error: error.message };
    }
}

export { getExercises, getExercise, createExercise, updateExercise, createAttempt, deleteExercise, createExerciseText, copyExercise };