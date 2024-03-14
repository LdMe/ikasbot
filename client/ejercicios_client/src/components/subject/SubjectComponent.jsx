import {  Link } from "react-router-dom";
import { useContext } from "react";
import loggedInContext from "../../context/loggedInContext";
const SubjectComponent = ({subject}) => {
    const {getBasePath} = useContext(loggedInContext)
    const getMappedLevel = (level) => {
        switch (level) {
            case "easy":
                return "Fácil";
            case "medium":
                return "Medio";
            case "difficult":
                return "Avanzado";
            default:
                return "Fácil";
        }
    }
    return (
        <div>
            <h1>Tema {subject.name}</h1>
            <p>Curso: <Link to={`${getBasePath()}/cursos/${subject.course._id}`}>{subject.course.name}</Link></p>
            <h2>Ejercicios:</h2>
            <ul className="list">
                {
                    subject.exercises.map((exercise) => (
                        <li key={exercise._id}>
                            <Link to={`${getBasePath()}/ejercicios/${exercise._id}`}>{exercise.name} | {getMappedLevel(exercise.level)}</Link>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}

export default SubjectComponent;