import { useLoaderData, Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import loggedInContext from "../context/loggedInContext";
import { createSubject, deleteSubject, getTeachers, removeTeacher,addTeacher,getStudents, enrollStudent,unenrollStudent } from "../util/apiCalls";
import AddUser from "../components/AddUser";

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
    const handleNewSubject = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const subject = { name, course: data.course._id };
        const response = await createSubject(subject);
        if(response){
            setData({ ...data, subjects: [...data.subjects, response] })
        }
        e.target.reset();
    }
    const handleDelete = async (id) => {

        if (subjectToDelete === id) {
            await deleteSubject(id, deleteExercises)
            navigate('.', { replace: true })
            setSubjectToDelete(null)
            setDeleteExercises(true)
            const newSubjects = data.subjects.filter((subject) => subject._id != id)
            setData({ ...data, subjects: newSubjects })
        }
        else {
            setSubjectToDelete(id)
        }
    }
    const handleCancelDelete = () => {
        setSubjectToDelete(null)
        setDeleteExercises(false)
    }
    const handleRemoveTeacher = async (teacherId) => {
        const response = await removeTeacher(data.course._id, teacherId)
        const newTeachers = data.course.teachers.filter((teacher) => teacher._id != teacherId)
        setData({ ...data, course: { ...data.course, teachers: newTeachers } })
    }
    const handleAddTeacher = (course) => {
        const newTeachers = course.teachers;
        console.log("teacher", newTeachers)
        setData({ ...data, course: { ...data.course, teachers: newTeachers } })
    }
    const handleEnroll = async (course) => {
        const newStudent = course;
        console.log("teacher", newStudent)
        setData({ ...data,  students: [...data.students, newStudent] })
    }
    const handleUnenrroll = async (studentId) => {
        const response = await unenrollStudent(data.course._id, studentId)
        console.log("response", data)
        console.log("studentId", studentId)
        const newStudents = data.students.filter((student) => student._id != studentId)
        console.log("newStudents", newStudents)
        setData({ ...data, students: newStudents})
    }
    console.log("roleeee", getUserRole())
    if (!data.course) return (<div>cargando...</div>)
    return (
        <div>
            <h1>Curso {data.course.name}</h1>
            <section className="subject-section">
                <h2>Temas</h2>
                {getUserRole() != "student" &&
                    <section className="new-subject">
                        <h3>Crear nuevo tema</h3>
                        <form onSubmit={handleNewSubject}>
                            <label htmlFor="name">Nombre</label>
                            <input type="text" id="name" />
                            <button type="submit">Crear</button>
                        </form>
                    </section>
                }
                <ul>
                    {data.subjects.map((subject) => (
                        <li key={subject._id}>
                            <Link to={`/temas/${subject._id}`}>{subject.name}</Link>

                            {getUserRole() != "student" &&
                                <>
                                    {subjectToDelete === subject._id ?
                                        <>
                                            <label htmlFor="deleteExercises">Eliminar ejercicios</label>
                                            <input type="checkbox" checked={deleteExercises} onChange={() => setDeleteExercises(!deleteExercises)} />
                                            <button onClick={() => handleDelete(subject._id)}>Confirmar</button>
                                            <button onClick={handleCancelDelete}>Cancelar</button>
                                        </>
                                        :
                                        <button onClick={() => handleDelete(subject._id)}>Eliminar</button>
                                    }
                                </>
                            }
                        </li>
                    ))}
                </ul>
            </section>
            {getUserRole() != "student" &&
                <section className="student-section">
                    <h2>Alumnos</h2>
                    <ul>
                        {
                            data.students.map((student) => (

                                <li key={student._id}>
                                    <Link to={`/profile/${student._id}`}>{student.username}</Link><button onClick={() => handleUnenrroll(student._id)}>Eliminar</button>
                                </li>
                            ))
                        }
                    </ul>
                    <AddUser
                    key={data.students}
                        courseId={data.course._id}
                        onAddUser={handleEnroll}
                        getUsers={getStudents}
                        addUser={enrollStudent}
                    />
                </section>

            }
            {getUserRole() == "admin" &&
                <section className="teacher-section">
                    <h2>Profesores</h2>

                    <ul>
                        {
                            data.course.teachers.map((teacher) => (

                                <li key={teacher._id}>
                                    <Link to={`/profile/${teacher._id}`}>{teacher.username}</Link> <button onClick={() => handleRemoveTeacher(teacher._id)}>Eliminar</button>
                                </li>
                            ))
                        }
                    </ul>
                    <AddUser
                    key={data.course.teachers}
                        courseId={data.course._id}
                        onAddUser={handleAddTeacher}
                        getUsers={getTeachers}
                        addUser={addTeacher}
                    />
                </section>
            }

        </div>
    );
}

export default Course;