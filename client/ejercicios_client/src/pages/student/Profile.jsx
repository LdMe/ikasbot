import { useEffect, useContext, useState } from 'react'
import { useParams, useNavigate,  Link,useOutletContext } from 'react-router-dom'
import { changeUserRole } from '../../util/api/user'
import loggedInContext from '../../context/loggedInContext'
import HealthBar from '../../components/healthBar/HealthBar'
import AttemptsShow from '../../components/AttemptsShow'
import CourseStats from '../../components/stats/CourseStats'
import TextShowHide from '../../components/TextShowHide'

const Profile = () => {
    const [user, setUser] = useState(useOutletContext())
    const { getBasePath } = useContext(loggedInContext)

    
    return (
        <div className="container">

                
                    <section className="courses">
                        {user.courses?.length > 0 ?
                            (
                                <>
                                    <h2>Cursos:</h2>
                                    {user.courses.map((course) => {
                                        return (
                                            <TextShowHide key={course._id}
                                            title ={
                                            <article key={course._id} className="course-info">
                                                <Link key={course._id} to={`${getBasePath()}/cursos/${course._id}`}><p>{course.name}</p></Link>
                                            </article>
                                            }
                                            >
                                                <CourseStats  key={course._id} course={course} students={[user]} />
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