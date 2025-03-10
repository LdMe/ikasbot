import { useLoaderData, Link } from "react-router-dom";
import SubjectComponent from "../../components/subject/SubjectComponent";
import { useContext } from "react";
import loggedInContext from "../../context/loggedInContext";
const Subject = () => {
    const { getBasePath } = useContext(loggedInContext)
    const subject = useLoaderData();
    return (
        <div>
            <div className="breadcrumb">
                <Link to={`${getBasePath()}/cursos/`}>Cursos</Link>
                <span>/</span>
                <Link to={`${getBasePath()}/cursos/${subject.course._id}`}>{subject.course.name}</Link>
                <span>/</span>
                <Link to={`${getBasePath()}/temas/${subject._id}`}>{subject.name}</Link>
            </div>
            <SubjectComponent originalSubject={subject} />
            <Link to={`${getBasePath()}/ejercicios/nuevo?subject=${subject._id}`}>Nuevo Ejercicio</Link>
        </div>
    );
}

export default Subject;