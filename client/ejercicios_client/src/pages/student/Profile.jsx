import { useContext} from 'react'
import {  useLoaderData } from 'react-router-dom'
import loggedInContext from '../../context/loggedInContext'
import CourseStats from '../../components/stats/CourseStats'
import TextShowHide from '../../components/TextShowHide'


const Profile = () => {
    const {user} = useLoaderData()
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
                            <p>No estás inscrito a ningún curso</p>
                        }
                    </section>
        </div>
    )
}

export default Profile