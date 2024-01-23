import {fetchApi} from '../helpers';
const refreshAuth = async () => {
    try {
        const url = `/auth/refresh`;
        return await fetchApi(url,"POST");
    }
    catch (err) {
        console.error(err);
        return {error: err.message}
    }
}

const logout = async () => {
    try {
        const url = `/auth/logout`;
        return await fetchApi(url,"POST");
    }
    catch (error) {
        console.error(error)
        return { error: error.message };
    }
}

const login = async (email,password) => {
    try {
        const url = `/auth/login`;
        return await fetchApi(url,"POST",{email,password});
    }
    catch (error) {
        console.error(error)
        return { error: error.message };
    }
}
const register = async (name,email,password,passwordConfirm) => {
    try {
        const url = `/auth/register`;
        return await fetchApi(url,"POST",{name,email,password,passwordConfirm});
    }
    catch (error) {
        console.error(error)
        return { error: error.message };
    }
}
export {
    refreshAuth,
    logout,
    login,
    register
}

