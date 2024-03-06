import { Link } from 'react-router-dom';
import HealthBar from '../healthBar/HealthBar';
import TextShowHide from '../TextShowHide';
import AttemptsShow from '../AttemptsShow';
import loggedInContext from '../../context/loggedInContext';
import { useContext, useEffect, useState } from 'react';
import "./Stats.scss";

const ExerciseStats = ({ exercise, students }) => {
    const { getBasePath } = useContext(loggedInContext)
    const getMappedLevel = (level) => {
        switch (level) {
            case "easy":
                return "Fácil";
            case "medium":
                return "Medio";
            case "difficult":
                return "Avanzado";
            default:
                return "Fácil";
        }
    }
    return (
        
        <div className="exercise">
            <Link to={`${getBasePath()}/ejercicios/${exercise._id}`}>
            <h3> {exercise.name}</h3>
            <p>Nivel: {getMappedLevel(exercise.level)}</p>
            </Link>
            
            {students?.length > 1 && <h4>Estudiantes:</h4>}
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