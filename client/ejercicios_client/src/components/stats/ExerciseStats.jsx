import { Link } from 'react-router-dom';
import HealthBar from '../healthBar/HealthBar';
import TextShowHide from '../TextShowHide';
import AttemptsShow from '../AttemptsShow';
import loggedInContext from '../../context/loggedInContext';
import { useContext, useEffect, useState } from 'react';
const ExerciseStats = ({ exercise, students }) => {
    const { getBasePath } = useContext(loggedInContext)

    return (
        <div className="exercises">
            <TextShowHide
                title={
                    <Link to={`${getBasePath()}/ejercicios/${exercise._id}`}><p>{exercise.name}</p></Link>
                }
            >
                <>
                    {students?.length > 1 && <h3>Estudiantes:</h3>}
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
                        if (!attempt) {
                            return (
                                <section className="exercise-info" key={student._id}>
                                    <article className="exercise-info">
                                        {students?.length > 1 &&
                                            <Link to={`${getBasePath()}/usuarios/${student._id}`}><p>{student.name}</p></Link>
                                        }
                                        <HealthBar hp={0} />
                                    </article>
                                </section>
                            )
                        }
                        return (
                            <section className="exercise-info" key={student._id}>
                                <article className="exercise-info">
                                    {students?.length > 1 &&
                                        <Link to={`${getBasePath()}/usuarios/${student._id}`}><p>{student.name}</p></Link>
                                    }
                                    <HealthBar hp={attempt.correct} maxHp={attempt.total} />
                                </article>
                            </section>
                        )
                    })}
                </>
            </TextShowHide>
        </div>
    );
}


export default ExerciseStats;