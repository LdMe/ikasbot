import { useLoaderData, Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import loggedInContext from "../../context/loggedInContext";
const Course = () => {
    const course=useLoaderData();
    const {getBasePath} = useContext(loggedInContext)
    if (!course) return (<div>cargando...</div>)
    return (
        <div>
            <h1>Curso {course.name}</h1>
            <section className="subject-section">
                <h2>Temas</h2>
                <ul>
                    {course.subjects.map((subject) => (
                        <li key={subject._id}>
                            <Link to={`${getBasePath()}/temas/${subject._id}`}>{subject.name}</Link>
                        </li>
                    ))}
                </ul>
            </section>

        </div>
    );
}

export default Course;