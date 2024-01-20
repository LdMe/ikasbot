import { useLoaderData } from "react-router-dom"
import {Link} from "react-router-dom"
const Exercises = () => {
    const data = useLoaderData();
    return (
        <div>
            <h1>Exercises</h1>
            <ul>
                {data.map((exercise) => (
                    <li key={exercise._id}>
                        <Link to={`/exercises/${exercise._id}`}>{exercise.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Exercises