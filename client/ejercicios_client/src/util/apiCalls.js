
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;




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






export {
    refreshAuth,
    logout,
}

