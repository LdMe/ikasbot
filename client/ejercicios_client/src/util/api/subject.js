import {fetchApi} from '../helpers';

const getSubject = async (id) => {
    try {
        const url = `/subject/${id}`;
        const result = await fetchApi(url,"GET");
        return result;
    }
    catch (err) {
        console.error(err);
        return {error: err.message};
    }
}

const getSubjects = async (courseId) => {
    try {
        const url = `/subject/`;
        const result = await fetchApi(url,"GET",{course:courseId});
        return result;
    }
    catch (err) {
        console.error(err);
        return {error: err.message};
    }
    
}
const createSubject = async (data) => {
    try {
        const url = `/subject`;
        return await fetchApi(url,"POST",data);
    }
    catch (error) {
        console.error(error)
        return { error: error.message };
    }
}

const deleteSubject = async (id,deleteExercises=true) => {
    try {
        const url = `/subject/${id}`;
        return await fetchApi(url,"DELETE",{cascade:deleteExercises});
    }
    catch (error) {
        console.error(error)
        return { error: error.message };
    }
}

const renameSubject = async (id, name) => {
    try {
        const url = `/subject/${id}`;
        return await fetchApi(url,"PUT",{name:name});
    }
    catch (error) {
        console.error(error)
        return { error: error.message };
    }
}
const copySubject = async (id, courseId) => {
    try {
        const url = `/subject/${id}/copy`;
        return await fetchApi(url,"POST",{course:courseId});
    }
    catch (error) {
        console.error(error)
        return { error: error.message };
    }
}
export {createSubject, getSubject, getSubjects, deleteSubject, renameSubject, copySubject};