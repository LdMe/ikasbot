import { useContext } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import loggedInContext from '../../context/loggedInContext'
import PasswordChange from '../../components/profile/PasswordChange'
import HealthBar from '../../components/healthBar/HealthBar';
import TextShowHide from '../../components/TextShowHide';

const Profile = () => {
    const { user } = useLoaderData()
    const { getBasePath } = useContext(loggedInContext)
    return (
        <div className="container">
            <section className="profile">
                <h2>Hola, {user.name}</h2>
                <TextShowHide title="información personal" >

                    <article className="profile-info">
                        <p className="user-name"><b>Nombre:</b> {user.name}</p>
                        <p className="user-email"><b>Email:</b> {user.email}</p>
                    </article>

                    <PasswordChange user={user} />
                </TextShowHide>
            </section>

            <section className="courses">
                {user.courses?.length > 0 ?
                    (
                        <>
                            <h2>Cursos:</h2>
                            {user.courses.map((course) => {
                                const courseSubjects = course.subjects
                                let hp = 0;
                                let maxHp = 0;
                                courseSubjects.forEach(subject => {
                                    const subjectStats = user.stats.find(stat => stat.subject.subject == subject._id);
                                    if (subjectStats) {
                                        hp += subjectStats.subject.correctExercises
                                    }
                                    maxHp += subject.exercises.length
                                })
                                return (
                                    <Link to={`${getBasePath()}/cursos/${course._id}`} key={course._id}>
                                        <section className='course-info__card' >

                                            <h3>{course.name}</h3>
                                            <HealthBar hp={hp} maxHp={maxHp} />
                                        </section>
                                    </Link>
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