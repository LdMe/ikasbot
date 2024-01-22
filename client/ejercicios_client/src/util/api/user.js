import { fetchApi } from "../helpers";
import { calculateCourseScores } from "./course";


const getUsersByRole = async (query,limit=10,role,notInCourse="") => {
    try {
        const url = `/user/by_role?limit=${limit}&query=${query}&not_course=${notInCourse}&role=${role}`;
        return  await fetchApi(url,"GET");
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
        const url = `/user?limit=${limit}&query=${query}`;
        return await fetchApi(url,"GET");
    }
    catch (error) {
        console.error(error)
        return {error: error.message };
    }
}

const getUserData = async (id=null) => {
    try {
        const url = id ? `/user/${id}` : `/user/profile`;
        const data = await fetchApi(url,"GET");
        if(data.error){
            return {error: data.error};
        }
        data.courses = calculateCourseScores(data.courses);
        return data;
    }
    catch (error) {
        console.error(error)
        return { error: error.message };
    }
}

const changeUserRole = async (id,role) => {
    try {
        const url = `/user/${id}`;
        return await fetchApi(url,"PUT",{role:role});
    }
    catch (error) {
        console.error(error)
        return { error: error.message };
    }
}

export {
    getAllUsers,
    getUserData,
    changeUserRole,
    getTeachers,
    getStudents,
}