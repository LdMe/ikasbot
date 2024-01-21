import { useEffect, useContext, useState } from 'react'
import { useParams, useNavigate,  Link,useOutletContext } from 'react-router-dom'
import { changeUserRole } from '../../util/apiCalls'
import loggedInContext from '../../context/loggedInContext'
import HealthBar from '../../components/healthBar/HealthBar'
import AttemptsShow from '../../components/AttemptsShow'
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
                                                <Link key={course._id} to={`cursos/${course._id}`}><p>{course.name}</p></Link>
                                                <HealthBar hp={course.totalExercisesPassed} maxHp={course.totalExercises} />
                                            </article>
                                            }
                                            >
                                                <CourseStats  key={course._id} course={course} />
                                            </TextShowHide>
                                        )
                                    })}
                                </>
                            ) :
                            <p>No estás inscrito a ningún curso</p>
                        }
                    </section>
        </div>
    )
}

export default Profile