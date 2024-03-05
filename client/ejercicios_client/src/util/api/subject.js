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

export {createSubject, getSubject, deleteSubject};