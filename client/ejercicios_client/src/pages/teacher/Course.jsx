import { useLoaderData, Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import loggedInContext from "../../context/loggedInContext";
import { createSubject, deleteSubject } from "../../util/api/subject";
import { getTeachers, getStudents } from "../../util/api/user";
import { addTeacher, removeTeacher, enrollStudent, unenrollStudent } from "../../util/api/course";
import { FaXmark } from "react-icons/fa6";
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
        setDeleteExercises(true)
    }
    const handleRemoveTeacher = async (teacherId) => {
        const response = await removeTeacher(course._id, teacherId)
        const newTeachers = course.teachers.filter((teacher) => teacher._id != teacherId)

        setCourse({ ...course, teachers: newTeachers })
    }
    const handleAddTeacher = (course) => {
        const newTeachers = course.teachers
        setCourse({ ...course, teachers: newTeachers })
    }
    const handleEnroll = async (course) => {
        const newStudent = course;
        setCourse({ ...course, students: [...course.students, newStudent] })
    }
    const handleUnenrroll = async (studentId) => {
        const response = await unenrollStudent(course._id, studentId)
        const newStudents = course.students.filter((student) => student._id != studentId)
        setCourse({ ...course, students: newStudents })
    }
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

                <ul className="list">
                    {course.subjects.map((subject) => (
                        <li key={subject._id}>
                            <Link to={`${getBasePath()}/temas/${subject._id}`}>
                                <h3>{subject.name}</h3>
                                </Link>
                            <>
                                {subjectToDelete === subject._id ?
                                    <>
                                        <label htmlFor="deleteExercises">Eliminar ejercicios</label>
                                        <input type="checkbox" checked={deleteExercises} onChange={() => setDeleteExercises(!deleteExercises)} />
                                        <button onClick={() => handleDelete(subject._id)}>Confirmar</button>
                                        <button onClick={handleCancelDelete}>Cancelar</button>
                                    </>
                                    :
                                    <button className="icon incorrect" onClick={() => handleDelete(subject._id)}><FaXmark/></button>
                                }
                            </>
                        </li>
                    ))}
                </ul>
                <section className="new-subject">
                    <TextShowHide title={<h3>Crear nuevo tema</h3>}>
                    <form className="form-new" onSubmit={handleNewSubject}>
                        <label htmlFor="name">Nombre</label>
                        <input type="text" id="name" />
                        <button type="submit">Crear</button>
                    </form>
                    </TextShowHide>
                </section>
            </section>
            <section className="student-section">
                <h2>Alumnos</h2>

                <ul className="list">
                    {
                        course.students.map((student) => (

                            <li key={student._id}>
                                <Link to={`${getBasePath()}/usuarios/${student._id}`}><h3>{student.name}</h3></Link><button className="icon incorrect" onClick={() => handleUnenrroll(student._id)}><FaXmark/></button>
                            </li>
                        ))
                    }
                </ul>

                <section className="add-student">
                    <h3>Matricular alumnos</h3>
                    <AddUser
                        key={course.students}
                        courseId={course._id}
                        onAddUser={handleEnroll}
                        getUsers={getStudents}
                        addUser={enrollStudent}
                    />
                </section>
            </section>

            {getUserRole() == "admin" &&
                <section className="teacher-section">
                    <h2>Profesores</h2>
                    <ul className="list">
                        {
                            course.teachers.map((teacher) => (
                                <li key={teacher._id}>
                                    <Link to={`${getBasePath()}/usuarios/${teacher._id}`}><h3>{teacher.name}</h3></Link> <button className="icon incorrect" onClick={() => handleRemoveTeacher(teacher._id)}><FaXmark/></button>
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