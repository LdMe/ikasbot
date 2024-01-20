import { useEffect, useContext, useState } from 'react'
import { useParams, useNavigate, useLoaderData, Link} from 'react-router-dom'
import loggedInContext from '../context/loggedInContext'
import HealthBar from '../components/healthBar/HealthBar'

const Profile = () => {
    const [user, setUser] = useState(useLoaderData())
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
    const formatTime = (time) => {
        const date = new Date(time)
        return date.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" }).replace("de", "") + " " + date.toLocaleTimeString()
    }
    return (
        <div className="container">
            <h1>Perfil</h1>
            <h2>Nombre: {user.username}</h2>
            <h2>Rol: {mapRole(user.role)}</h2>
            {user.role == "student" && (
                <>
                    <section className="courses">
                        {user.courses.length > 0 ?
                            (
                                <>
                                    <h2>Cursos:</h2>
                                    {user.courses.map((course) => {
                                        return <Link to={`/cursos/${course._id}`}><p>{course.name}</p></Link>
                                    })}
                                </>
                            ) :
                            <p>El usuario no está inscrito a ningún curso</p>
                        }
                    </section>
                    <section className="attempts">
                        {user.attempts.length > 0 ?
                            (
                                <>
                                    <h2>Ejercicios:</h2>
                                    {user.attempts.map((attempt) => {
                                        return (
                                            <>
                                                <p>{attempt.exercise.name}</p>
                                                <p>{formatTime(attempt.createdAt)}</p>
                                                <HealthBar hp={attempt.correct_percentage} />
                                            </>
                                        )
                                    })}
                                </>
                            ) :
                            <p>El usuario no ha realizado ningún ejercicio</p>
                        }
                    </section>
                </>
            )}

        </div>
    )
}

export default Profile