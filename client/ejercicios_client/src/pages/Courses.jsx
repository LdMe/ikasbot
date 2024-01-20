import { useLoaderData,Link } from "react-router-dom";
import { useEffect,useContext } from "react";
import { useNavigate } from "react-router-dom";
import loggedInContext from "../context/loggedInContext";


const Courses = () => {
    const data = useLoaderData();
    const navigate = useNavigate();
    const {getUserRole} = useContext(loggedInContext);
    useEffect(() => {
        if (data.error) {
            navigate('/login', { replace: true })
        }
    }, [])
    if(data && data.error)
    {
        return <div>error</div>
    }
    return (
        <div>
            <h1>Cursos</h1>
            <ul>
                {data.map((course) => (
                    <li key={course._id}>
                        <Link to={`/cursos/${course._id}`}>{course.name}</Link>
                    </li>
                ))}
            </ul>
            {getUserRole() == "admin" && (
                <Link to="/cursos/new">Crear curso</Link>
            )}
        </div>
    );
}

export default Courses;