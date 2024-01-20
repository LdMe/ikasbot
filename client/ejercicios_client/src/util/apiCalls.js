

const getExercises = async () => {
    try {
        const response = await fetch('http://localhost:3001/exercises', {
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
        const response = await fetch(`http://localhost:3001/exercises/${id}`, {
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
        const response = await fetch('http://localhost:3001/exercises', {
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
        const response = await fetch(`http://localhost:3001/exercises/${id}`, {
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
        const response = await fetch(`http://localhost:3001/exercises/${id}`, {
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
        const response = await fetch('http://localhost:3001/test', {
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

const getCourses = async () => {
    try {
        const response = await fetch('http://localhost:3001/course', {
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

const getCourse = async (id) => {
    try {
        const response = await fetch(`http://localhost:3001/course/${id}`, {
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
const createCourse = async (data) => {
    try {
        const response = await fetch('http://localhost:3001/course', {
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


const getSubject = async (id) => {
    try {
        const response = await fetch(`http://localhost:3001/subject/${id}`, {
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
        const response = await fetch('http://localhost:3001/auth/refresh', {
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
        const response = await fetch('http://localhost:3001/subject', {
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
        const response = await fetch(`http://localhost:3001/subject/${id}?cascade=${cascade}`, {
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
        const response = await fetch('http://localhost:3001/auth/logout', {
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
const getUsersByRole = async (query,limit=10,role,course="") => {
    try {
        const response = await fetch(`http://localhost:3001/user/by_role?limit=${limit}&query=${query}&not_course=${course}&role=${role}`, {
            method: 'GET',
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
const getTeachers = async (query,limit=10,course="") => {
    return getUsersByRole(query,limit,"teacher",course);
}
const getStudents = async (query,limit=10,course="") => {
    return getUsersByRole(query,limit,"student",course);
}
const addTeacher = async (courseId,teacherId) => {
    try {
        const response = await fetch(`http://localhost:3001/course/${courseId}/teacher/`, {
            method: 'POST',
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({teacher:teacherId}),
        });
        const result = await response.json();
        return result;
    }
    catch (error) {
        console.error(error)
        return { success: false, message: error.message };
    }
}

const removeTeacher = async (courseId,teacherId) => {
    try {
        const response = await fetch(`http://localhost:3001/course/${courseId}/teacher/`, {
            method: 'DELETE',
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({teacher:teacherId}),
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
        const response = await fetch(`http://localhost:3001/course/${courseId}/enroll/`, {
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
        const response = await fetch(`http://localhost:3001/course/${courseId}/enroll/`, {
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

const getUserData = async (id) => {
    try {
        const response = await fetch(`http://localhost:3001/user/${id}`, {
            method: 'GET',
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


export {
    getExercises,
    getExercise,
    createExercise,
    updateExercise,
    createAttempt,
    deleteExercise,
    getCourses,
    getCourse,
    createCourse,
    getSubject,
    refreshAuth,
    createSubject,
    deleteSubject,
    logout,
    getTeachers,
    addTeacher,
    removeTeacher,
    getStudents,
    enrollStudent,
    unenrollStudent,
    getUserData,
}

