import {  useContext, useState } from 'react'
import {   Link,  useLoaderData,useNavigate } from 'react-router-dom'
import { changeUserRole,deleteUser } from '../../util/api/user'
import loggedInContext from '../../context/loggedInContext'
import HealthBar from '../../components/healthBar/HealthBar'
import CourseStats from '../../components/stats/CourseStats'
import TextShowHide from '../../components/TextShowHide'
import { FaXmark } from 'react-icons/fa6'
import PasswordChange from '../../components/profile/PasswordChange'

const User = () => {
    const [user, setUser] = useState(useLoaderData().user)
    const { getBasePath, getUserRole } = useContext(loggedInContext)
    const navigate = useNavigate()

    const handleChangeRole = (e) => {
        const role = e.target.value;
        setUser({ ...user, role })
        changeUserRole(user._id, role).then((response) => {
        })
    }
    const handleDelete = (id) => {
        if(!confirm('Seguro que quieres borrar el usuario?')) return;   
        deleteUser(id).then(() => {
            navigate('/profesorado/usuarios')
        })
    }
    return (
        <div className="container">
            <h1>Perfil</h1>
            <h2>Nombre: {user.name} <button className="icon incorrect" onClick={() => handleDelete(user._id)}><FaXmark /></button></h2>
            
            {getUserRole() == "admin" &&
                <select name="role" id="role" value={user.role} onChange={handleChangeRole}>
                    <option value="student">Estudiante</option>
                    <option value="teacher">Profesor</option>
                    <option value="admin">Administrador</option>
                </select>
            }

            <PasswordChange user={user} isAdmin={getUserRole() == "admin"}/>
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