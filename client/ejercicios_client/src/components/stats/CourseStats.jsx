import { Link } from 'react-router-dom';
import HealthBar from '../healthBar/HealthBar';
import TextShowHide from '../TextShowHide';
import AttemptsShow from '../AttemptsShow';
import loggedInContext from '../../context/loggedInContext';
import { useContext, useEffect, useState } from 'react';
import SubjectStats from './SubjectStats';
const CourseStats = ({ course, students }) => {
    const { getBasePath } = useContext(loggedInContext)
    const [showStudents, setShowStudents] = useState(false);

    if (showStudents) {
        return (
            <div className="course-card">

                <div className="section-buttons">
                    <button onClick={() => setShowStudents(false)}>Temas</button>
                    <button className="selected" >Resultados</button>
                </div>
                {students?.length > 1 && <h3>Estudiantes:</h3>}
                {students?.map((student) => {
                    const attempt = student.attempts.find(attempt => attempt.course == course._id)
                    console.log("attempt", attempt)
                    if (!attempt) {
                        return (
                            <section className="user-info" key={student._id}>
                                <article className="user-info">
                                    {students?.length > 1 &&
                                        <Link to={`${getBasePath()}/usuarios/${student._id}`}><p>{student.name}</p></Link>
                                    }
                                    <HealthBar hp={0} />
                                </article>
                            </section>
                        )
                    }
                    return (
                        <section className="user-info" key={student._id}>
                            <article className="user-info">
                                {students?.length > 1 &&
                                    <Link to={`${getBasePath()}/usuarios/${student._id}`}><p>{student.name}</p></Link>
                                }
                                <HealthBar hp={attempt.correct} maxHp={attempt.total} />
                            </article>
                        </section>
                    )
                })}
            </div>
        );
    }
    return (
        <div className="course-card">
            <div className="section-buttons">
                <button className="selected">Temas</button>
                <button onClick={() => setShowStudents(true)}>Resultados</button>
            </div>
            <h3>Temas:</h3>
            <section className="subjects" >
                {course.subjects?.map((subject) => {
                    return (
                        <SubjectStats key={subject._id} subject={subject} students={students} />
                    )
                })
                }
            </section>
        </div>
    );
}

export default CourseStats;