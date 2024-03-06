import {  useContext, useState } from 'react'
import {   Link,  useLoaderData } from 'react-router-dom'
import { changeUserRole } from '../../util/api/user'
import loggedInContext from '../../context/loggedInContext'
import HealthBar from '../../components/healthBar/HealthBar'
import CourseStats from '../../components/stats/CourseStats'
import TextShowHide from '../../components/TextShowHide'

const User = () => {
    const [user, setUser] = useState(useLoaderData().user)
    const { getBasePath, getUserRole } = useContext(loggedInContext)


    const handleChangeRole = (e) => {
        const role = e.target.value;
        setUser({ ...user, role })
        changeUserRole(user._id, role).then((response) => {
        })
    }
    console.log("User", user)
    return (
        <div className="container">
            <h1>Perfil</h1>
            <h2>Nombre: {user.name}</h2>
            {getUserRole() == "admin" &&
                <select name="role" id="role" value={user.role} onChange={handleChangeRole}>
                    <option value="student">Estudiante</option>
                    <option value="teacher">Profesor</option>
                    <option value="admin">Administrador</option>
                </select>
            }
            <section className="courses">
                

                {user.courses?.length > 0 ?
                    (
                        <>
                            <h2>Cursos:</h2>
                            {user.courses.map((course) => {
                                return (
                                    <TextShowHide key={course._id}
                                        title={
                                            <article key={course._id} className="course-info">
                                                <p>{course.name}</p>
                                                
                                            </article>
                                        }
                                    >
                                        <CourseStats  key={course._id} course={course} students={[user]} />
                                    </TextShowHide>
                                )
                            })}
                        </>
                    ) :
                    <p>No está inscrito a ningún curso</p>
                }
            </section>
        </div>
    )
}

export default User