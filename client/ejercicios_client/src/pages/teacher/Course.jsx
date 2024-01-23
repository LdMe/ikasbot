import { useLoaderData, Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import loggedInContext from "../../context/loggedInContext";
import { createSubject, deleteSubject } from "../../util/api/subject";
import { getTeachers, getStudents } from "../../util/api/user";
import { addTeacher, removeTeacher, enrollStudent, unenrollStudent } from "../../util/api/course";
import AddUser from "../../components/AddUser";
import TextShowHide from "../../components/TextShowHide";
import CourseStats from "../../components/stats/CourseStats";

const Course = () => {
    const [course, setCourse] = useState(useLoaderData());
    const [showStats, setShowStats] = useState(false);
    const [subjectToDelete, setSubjectToDelete] = useState(null);
    const [deleteExercises, setDeleteExercises] = useState(true);
    const { getUserRole, getBasePath } = useContext(loggedInContext);
    const navigate = useNavigate();

    const handleNewSubject = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const subject = { name, course: course._id };
        const response = await createSubject(subject);
        if (response) {
            setCourse({ ...course, subjects: [...course.subjects, response] })
        }
        e.target.reset();
    }
    const handleDelete = async (id) => {

        if (subjectToDelete === id) {
            await deleteSubject(id, deleteExercises)
            navigate('.', { replace: true })
            setSubjectToDelete(null)
            setDeleteExercises(true)
            const newSubjects = course.subjects.filter((subject) => subject._id != id)
            setCourse({ ...course, subjects: newSubjects })
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
        const response = await removeTeacher(course._id, teacherId)
        const newTeachers = course.teachers.filter((teacher) => teacher._id != teacherId)

        setCourse({ ...course, teachers: newTeachers })
    }
    const handleAddTeacher = (course) => {
        const newTeachers = course.teachers
        console.log("teacher", newTeachers)
        setCourse({ ...course, teachers: newTeachers })
    }
    const handleEnroll = async (course) => {
        const newStudent = course;
        console.log("teacher", newStudent)
        setCourse({ ...course, students: [...course.students, newStudent] })
    }
    const handleUnenrroll = async (studentId) => {
        const response = await unenrollStudent(course._id, studentId)
        console.log("response", course)
        console.log("studentId", studentId)
        const newStudents = course.students.filter((student) => student._id != studentId)
        console.log("newStudents", newStudents)
        setCourse({ ...course, students: newStudents })
    }
    console.log("roleeee", getUserRole())
    if (!course) return (<div>cargando...</div>)
    if (showStats) {
        return (
            <div>
                <h1>Curso {course.name}</h1>
                <button onClick={() => setShowStats(false)}>Editar</button>
                <button className="selected" >Estadísticas</button>
                <CourseStats course={course} students={course.students} />
            </div>
        )
    }
    return (
        <div>
            <h1>Curso {course.name}</h1>
            <button className="selected">Editar</button>
            <button onClick={() => setShowStats(true)}>Estadísticas</button>
            <section className="subject-section">
                <h2>Temas</h2>
                <TextShowHide
                    title={<h3>Crear nuevo tema</h3>}
                >
                    <section className="new-subject">

                        <form onSubmit={handleNewSubject}>
                            <label htmlFor="name">Nombre</label>
                            <input type="text" id="name" />
                            <button type="submit">Crear</button>
                        </form>
                    </section>
                </TextShowHide>

                <ul>
                    {course.subjects.map((subject) => (
                        <li key={subject._id}>
                            <Link to={`${getBasePath()}/temas/${subject._id}`}>{subject.name}</Link>
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
                        </li>
                    ))}
                </ul>
            </section>
            <section className="student-section">
                <h2>Alumnos</h2>
                <TextShowHide
                    title={<h3>Añadir alumno</h3>}
                >
                    <AddUser
                        key={course.students}
                        courseId={course._id}
                        onAddUser={handleEnroll}
                        getUsers={getStudents}
                        addUser={enrollStudent}
                    />
                </TextShowHide>
                <ul>
                    {
                        course.students.map((student) => (

                            <li key={student._id}>
                                <Link to={`${getBasePath()}/usuarios/${student._id}`}>{student.name}</Link><button onClick={() => handleUnenrroll(student._id)}>Eliminar</button>
                            </li>
                        ))
                    }
                </ul>
                
            </section>

            {getUserRole() == "admin" &&
                <section className="teacher-section">
                    <h2>Profesores</h2>
                    <ul>
                        {
                            course.teachers.map((teacher) => (
                                <li key={teacher._id}>
                                    <Link to={`${getBasePath()}/usuarios/${teacher._id}`}>{teacher.name}</Link> <button onClick={() => handleRemoveTeacher(teacher._id)}>Eliminar</button>
                                </li>
                            ))
                        }
                    </ul>
                    <TextShowHide
                        title={<h3>Añadir profesor</h3>}
                    >
                        <AddUser
                            key={course.teachers}
                            courseId={course._id}
                            onAddUser={handleAddTeacher}
                            getUsers={getTeachers}
                            addUser={addTeacher}
                        />
                    </TextShowHide>
                </section>
            }

        </div>
    );
}

export default Course;