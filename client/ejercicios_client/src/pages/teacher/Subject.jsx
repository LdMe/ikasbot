import { useLoaderData, Link } from "react-router-dom";
import { useContext } from "react";
import loggedInContext from "../../context/loggedInContext";
import TextShowHide from "../../components/TextShowHide";
const Subject = () => {
    const data = useLoaderData();
    const { getUserRole } = useContext(loggedInContext);
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
            <h1>Tema {data.name}</h1>
            <p>Curso: <Link to={`../cursos/${data.course._id}`}>{data.course.name}</Link></p>
            <ul>
                {
                    data.exercises.map((exercise) => (
                        <li key={exercise._id}>
                            <Link to={`../ejercicios/${exercise._id}`}>{exercise.name} | {getMappedLevel(exercise.level)}</Link>
                        </li>
                    ))
                }
            </ul>
            <Link to={`../ejercicios/nuevo?subject=${data._id}`}>Nuevo Ejercicio</Link>
        </div>
    );
}

export default Subject;