
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getExercises = async () => {
    try {
        const response = await fetch(`${BACKEND_URL}/exercises`, {
            method: 'GET',
            credentials: "include",
        });
        const data = await response.json();
        return data;
    }
    catch (err) {
        console.error(err);
        return [];
    }
}

const getExercise = async (id) => {
    try {
        const response = await fetch(`${BACKEND_URL}/exercises/${id}`, {
            method: 'GET',
            credentials: "include",
        });
        const data = await response.json();
        return data;
    }
    catch (err) {
        console.error(err);
        return [];
    }
}
const createExercise = async (data) => {
    try {
        const response = await fetch(`${BACKEND_URL}/exercises`, {
            method: 'POST',
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        return result;
    }
    catch (error) {
        console.error(error)
        return { success: false, message: error.message };
    }
}
const updateExercise = async (id, data) => {
    try {
        const response = await fetch(`${BACKEND_URL}/exercises/${id}`, {
            method: 'PUT',
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        return result;
    }
    catch (error) {
        console.error(error)
        return { success: false, message: error.message };
    }
}
const deleteExercise = async (id) => {
    try {
        const response = await fetch(`${BACKEND_URL}/exercises/${id}`, {
            method: 'DELETE',
            credentials: "include",
        });
        const result = await response.json();
        return result;
    }
    catch (error) {
        console.error(error)
        return { success: false, message: error.message };
    }
}
const createAttempt = async (exerciseId, code) => {
    try {
        const data = { code: code, id: exerciseId };
        console.log(data)
        const response = await fetch(`${BACKEND_URL}/test`, {
            method: 'POST',
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log(result)
        return result;

    }
    catch (error) {
        console.error(error)
        return { success: false, message: error.message };
    }
}

const getSubject = async (id) => {
    try {
        const response = await fetch(`${BACKEND_URL}/subject/${id}`, {
            method: 'GET',
            credentials: "include",
        });
        const data = await response.json();
        console.log(data)
        return data;
    }
    catch (err) {
        console.error(err);
        return [];
    }
}

const refreshAuth = async () => {
    try {
        const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
            method: 'POST',
            credentials: "include",
        });
        const data = await response.json();
        console.log(data)
        return data;
    }
    catch (err) {
        console.error(err);
        return {error: err.message}
    }
}

const createSubject = async (data) => {
    try {
        const response = await fetch(`${BACKEND_URL}/subject`, {
            method: 'POST',
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        return result;
    }
    catch (error) {
        console.error(error)
        return { success: false, message: error.message };
    }
}

const deleteSubject = async (id,deleteExercises) => {
    try {
        const cascade = deleteExercises ? true : false;
        const response = await fetch(`${BACKEND_URL}/subject/${id}?cascade=${cascade}`, {
            method: 'DELETE',
            credentials: "include",
        });
        const result = await response.json();
        return result;
    }
    catch (error) {
        console.error(error)
        return { success: false, message: error.message };
    }
}

const logout = async () => {
    try {
        const response = await fetch(`${BACKEND_URL}/auth/logout`, {
            method: 'POST',
            credentials: "include",
        });
        const result = await response.json();
        return result;
    }
    catch (error) {
        console.error(error)
        return { success: false, message: error.message };
    }
}





const enrollStudent = async (courseId,studentId) => {
    try {
        const response = await fetch(`${BACKEND_URL}/course/${courseId}/enroll/`, {
            method: 'POST',
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({student:studentId}),
        });
        const result = await response.json();
        return result;
    }
    catch (error) {
        console.error(error)
        return { success: false, message: error.message };
    }
}

const unenrollStudent = async (courseId,studentId) => {
    try {
        const response = await fetch(`${BACKEND_URL}/course/${courseId}/enroll/`, {
            method: 'DELETE',
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({student:studentId}),
        });
        const result = await response.json();
        return result;
    }
    catch (error) {
        console.error(error)
        return { success: false, message: error.message };
    }
}

export {
    getExercises,
    getExercise,
    createExercise,
    updateExercise,
    createAttempt,
    deleteExercise,
    getSubject,
    refreshAuth,
    createSubject,
    deleteSubject,
    logout,
    enrollStudent,
    unenrollStudent,
}

