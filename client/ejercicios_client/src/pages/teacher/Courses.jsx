import { useLoaderData, Link } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import loggedInContext from "../../context/loggedInContext";
import TextShowHide from "../../components/TextShowHide";
import { createCourse, deleteCourse } from "../../util/api/course";
import { FaXmark } from "react-icons/fa6";
const Courses = () => {
    const data = useLoaderData();
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();
    const { getUserRole, getBasePath } = useContext(loggedInContext);
    useEffect(() => {
        if (data.error) {
            navigate('/login', { replace: true })
        }
        else {
            setCourses(data)
        }
    }, [])

    const handleNewCourse = async (e) => {
        e.preventDefault();
        const name = e.target.name.value.trim();
        if (!name) {
            return;
        }
        const course = { name };
        const response = await createCourse(course);
        if (response) {
            setCourses([...courses, response])
        }
        e.target.reset();
    }
    const handleRemoveCourse = (id) => {
        if (!confirm("¿Estás seguro de que quieres eliminar el curso?")) {
            return;
        }
        const newCourses = courses.filter((course) => course._id != id)
        setCourses(newCourses)
        deleteCourse(id)
    }

    if (data && data.error) {
        return <div>error</div>
    }
    return (
        <div>
            <h1>Cursos</h1>
            <ul className="courses-list">
                {courses.map((course) => (
                    <li className="link" key={course._id}>
                        <Link to={`${getBasePath()}/cursos/${course._id}`}>
                            <h2>{course.name}</h2>
                        </Link>
                        {getUserRole() == "admin" && (
                            <button className="icon incorrect" onClick={() => handleRemoveCourse(course._id)}><FaXmark /></button>
                        )}
                    </li>
                ))}
            </ul>
            {getUserRole() == "admin" && (
                <TextShowHide title={
                    <h3>Crear nuevo curso</h3>
                }>
                    <form className="form-new" onSubmit={handleNewCourse}>
                        <label htmlFor="name">Nombre:</label>
                        <input type="text" name="name" id="name" />
                        <button type="submit">Crear</button>
                    </form>
                </TextShowHide>
            )}
        </div>
    );
}

export default Courses;