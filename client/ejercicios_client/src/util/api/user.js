import { fetchApi } from "../helpers";


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

const getTeachers = async (query,limit=10,notCourse="") => {
    return getUsersByRole(query,limit,"teacher",notCourse);
}

const getStudents = async (query,limit=10,notCourse="") => {
    return getUsersByRole(query,limit,"student",notCourse);
}

const getAllUsers = async (query="",limit=10,course=null) => {
    try {
        let url = `/user?limit=${limit}&query=${query}`;
        if(course){
            url+=`&course=${course}`;
        }
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
        //data.courses = calculateCourseScores(data.courses);
        return {user: data};
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