import { useEffect, useContext, useState } from 'react'
import { useParams, useNavigate,  Link,useOutletContext } from 'react-router-dom'
import { changeUserRole } from '../../util/api/user'
import loggedInContext from '../../context/loggedInContext'
import HealthBar from '../../components/healthBar/HealthBar'
import CourseStats from '../../components/CourseStats'
import TextShowHide from '../../components/TextShowHide'

const Profile = () => {
    const [user, setUser] = useState(useOutletContext())
    const { getUserName, getUserRole } = useContext(loggedInContext)

    const mapRole = (role) => {
        switch (role) {
            case "admin":
                return "Administrador"
            case "teacher":
                return "Profesor"
            case "student":
                return "Estudiante"
        }
    }


    const handleChangeRole = (e) => {
        const role = e.target.value;
        setUser({ ...user, role })
        changeUserRole(user._id, role).then((response) => {
            console.log(response)
        })
    }
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

            {user.role == "student" && (
                <>
                    <section className="courses">
                        {user.courses.length > 0 ?
                            (
                                <>
                                    <h2>Cursos:</h2>
                                    {user.courses.map((course) => {
                                        return (
                                            <TextShowHide key={course._id}
                                            title ={
                                            <article key={course._id} className="course-info">
                                                <Link key={course._id} to={`/cursos/${course._id}`}><p>{course.name}</p></Link>
                                                <HealthBar hp={course.totalExercisesPassed} maxHp={course.totalExercises} />
                                            </article>
                                            }
                                            >
                                                <CourseStats course={course} />
                                            </TextShowHide>
                                        )
                                    })}
                                </>
                            ) :
                            <p>El usuario no está inscrito a ningún curso</p>
                        }
                    </section>
                </>
            )}

        </div>
    )
}

export default Profile