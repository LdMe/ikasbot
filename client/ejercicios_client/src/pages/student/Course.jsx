import { useLoaderData, Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import loggedInContext from "../../context/loggedInContext";
import { createSubject, deleteSubject, getTeachers, removeTeacher, addTeacher, getStudents, enrollStudent, unenrollStudent } from "../../util/apiCalls";
import AddUser from "../../components/AddUser";
import TextShowHide from "../../components/TextShowHide";
const Course = () => {
    const [data, setData] = useState(useLoaderData())
    const [subjectToDelete, setSubjectToDelete] = useState(null);
    const [deleteExercises, setDeleteExercises] = useState(true);
    const { getUserRole } = useContext(loggedInContext);
    const navigate = useNavigate();
    useEffect(() => {
        console.log("dtaaa", data)
        if (data.error) {
            navigate('/login', { replace: true })
        }
    }, [])
    if (!data.course) return (<div>cargando...</div>)
    return (
        <div>
            <h1>Curso {data.course.name}</h1>
            <section className="subject-section">
                <h2>Temas</h2>
                <ul>
                    {data.subjects.map((subject) => (
                        <li key={subject._id}>
                            <Link to={`../temas/${subject._id}`}>{subject.name}</Link>
                        </li>
                    ))}
                </ul>
            </section>

        </div>
    );
}

export default Course;