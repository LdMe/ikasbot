import { BACKEND_URL } from "../constants";
import { calculateCourseScores } from "./course";


const getUsersByRole = async (query,limit=10,role,notInCourse="") => {
    try {
        const response = await fetch(`${BACKEND_URL}/user/by_role?limit=${limit}&query=${query}&not_course=${notInCourse}&role=${role}`, {
            method: 'GET',
            credentials: "include",
        });
        const result = await response.json();
        if(result.error || !result.data){
            return {  error: result.error };
        }
        return result.data;
    }
    catch (error) {
        console.error(error)
        return { error: error.message };
    }
}

const getTeachers = async (query,limit=10,course="") => {
    return getUsersByRole(query,limit,"teacher",course);
}

const getStudents = async (query,limit=10,course="") => {
    return getUsersByRole(query,limit,"student",course);
}

const getAllUsers = async (query="",limit=10) => {
    try {
        const response = await fetch(`${BACKEND_URL}/user?limit=${limit}&query=${query}`, {
            method: 'GET',
            credentials: "include",
        });
        const result = await response.json();
        const data = result.data;
        if(!data){
            return {error: result.error};
        }
        return data;
    }
    catch (error) {
        console.error(error)
        return {error: error.message };
    }
}

const getUserData = async (id=null) => {
    try {
        let url = id ? `${BACKEND_URL}/user/${id}` : `${BACKEND_URL}/user/profile`;
        const response = await fetch(url, {
            method: 'GET',
            credentials: "include",
        });
        const result = await response.json();
        const data = result.data;
        console.log("getUserData",result)
        data.courses = calculateCourseScores(data.courses);
        return data;
    }
    catch (error) {
        console.error(error)
        return { success: false, message: error.message };
    }
}

const changeUserRole = async (id,role) => {
    try {
        console.log("id",id,role)
        const response = await fetch(`${BACKEND_URL}/user/${id}`, {
            method: 'PUT',
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({role:role}),
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
    getAllUsers,
    getUserData,
    changeUserRole,
    getTeachers,
    getStudents,
}