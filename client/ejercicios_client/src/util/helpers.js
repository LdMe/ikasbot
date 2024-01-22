const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


const fetchApi = async (url, method, data) => {
    try {
        const options = {
            method,
            credentials: "include",
        }
        if (data) {
            options.headers = { 'Content-Type': 'application/json' };
            options.body = JSON.stringify(data);
        }
        const response = await fetch(`${BACKEND_URL}${url}`, options);
        const result = await response.json();
        if(result.error){
            return {error: result.error};
        }
        return result.data;
    }
    catch (error) {
        console.error(error)
        return {error: error.message};
    }
}
export {
    fetchApi
}

