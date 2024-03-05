import { Link } from 'react-router-dom';
import HealthBar from '../healthBar/HealthBar';
import TextShowHide from '../TextShowHide';
import AttemptsShow from '../AttemptsShow';
import loggedInContext from '../../context/loggedInContext';
import { useContext, useEffect, useState } from 'react';
const ExerciseStats = ({ exercise, students }) => {
    const { getBasePath } = useContext(loggedInContext)

    return (
        <div className="exercises-card">
            <h2><Link to={`${getBasePath()}/ejercicios/${exercise._id}`}> {exercise.name}</Link></h2>
            {students?.length > 1 && <h3>Estudiantes:</h3>}
            <section className="students">
                {students?.map((student) => {
                    // get attempts for an exercise inside a subject inside a course, we don't have course id, so we have to search in all courses
                    let attempt = null
                    student.attempts.forEach(studentAttempt => {
                        studentAttempt.subjects.forEach(subjectAttempt => {
                            subjectAttempt.exercises.forEach(exerciseAttempt => {
                                if (exerciseAttempt.exercise == exercise._id) {
                                    attempt = exerciseAttempt
                                }
                            }
                            )
                        })
                    })

                    return (
                        <section className="exercise-info" key={student._id}>
                            <article className="exercise-info">
                                {students?.length > 1 &&
                                    <Link to={`${getBasePath()}/usuarios/${student._id}`}><p>{student.name}</p></Link>
                                }
                                {attempt ?
                                    <HealthBar hp={attempt.correct} maxHp={attempt.total} />
                                    :
                                    <HealthBar hp={0} />
                                }

                            </article>
                        </section>
                    )
                })}
            </section>
        </div>
    );
}


export default ExerciseStats;