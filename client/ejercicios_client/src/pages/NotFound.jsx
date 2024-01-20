import { useRouteError } from 'react-router-dom';

const NotFound = () => {
    const error = useRouteError();
    console.error(error);
    return (
        <div>
            <h1>Not Found</h1>
            <p>The page you are looking for is <i>undefined</i> </p>
        </div>
    );
}

export default NotFound;