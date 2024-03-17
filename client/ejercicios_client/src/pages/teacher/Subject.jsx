import { useLoaderData, Link } from "react-router-dom";
import SubjectComponent from "../../components/subject/SubjectComponent";
import { useContext } from "react";
import loggedInContext from "../../context/loggedInContext";
const Subject = () => {
    const { getBasePath } = useContext(loggedInContext)
    const subject = useLoaderData();
    return (
        <div>
            <SubjectComponent originalSubject={subject} />
            <Link to={`${getBasePath()}/ejercicios/nuevo?subject=${subject._id}`}>Nuevo Ejercicio</Link>
        </div>
    );
}

export default Subject;