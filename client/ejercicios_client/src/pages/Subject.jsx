import { useLoaderData, Link } from "react-router-dom";
import { useContext } from "react";
import loggedInContext from "../context/loggedInContext";

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
            <h1>Subject {data.subject.name}</h1>
            <ul>
                {
                    data.exercises.map((exercise) => (
                        <li key={exercise._id}>
                            <Link to={`exercises/${exercise._id}`}>{exercise.name} | {getMappedLevel(exercise.level)}</Link>
                        </li>
                    ))
                }
            </ul>
            {getUserRole() != "student" &&
                <Link to={`exercises/new`}>Nuevo Ejercicio</Link>
            }
        </div>
    );
}

export default Subject;