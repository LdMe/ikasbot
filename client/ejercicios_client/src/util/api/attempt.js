import {fetchApi} from '../helpers';

// resave all attempts to trigger the exercise stats update
const resaveAttempts = async () => {
    try {
        const url = `/attempt/resave`;
        return await fetchApi(url,"POST");
    }
    catch (err) {
        console.error(err);
        return {error: err.message}
    }
}


export {
    resaveAttempts
}