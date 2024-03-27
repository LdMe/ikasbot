import { Link } from 'react-router-dom';
import HealthBar from '../healthBar/HealthBar';
import TextShowHide from '../TextShowHide';
import AttemptsShow from '../AttemptsShow';
import loggedInContext from '../../context/loggedInContext';
import { useContext, useEffect, useState } from 'react';
import "./Stats.scss";

const ExerciseStats = ({ exercise, students }) => {
    const { getBasePath,getUserRole } = useContext(loggedInContext)
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
                    let totalAttempts = 0;
                    /* // get attempts from the course of the exercise
                    const subjectAttempts = student.attempts.filter(attempt => attempt.subjects.find(subjectAttempt => subjectAttempt.subject == exercise.subject));
                    // get only the exercise attempts
                    const exercisesAttempts = subjectAttempts.map(attempt => attempt.subjects.find(subjectAttempt => subjectAttempt.subject == exercise.subject).exercises);

                    const thisExerciseAttempts = exercisesAttempts.flat().filter(attempt => attempt.exercise == exercise._id);
                    if(thisExerciseAttempts.length > 0){
                        const attempts = thisExerciseAttempts[0];
                        bestAttempt = attempts.bestAttempt;
                        totalAttempts = attempts.attempts.length;
                    } */
                    const subjectStats = student.stats.find(stat => stat.exercises.find(exerciseStat => exerciseStat.exercise == exercise._id));
                    const exerciseStats = subjectStats ? subjectStats.exercises.find(exerciseStat => exerciseStat.exercise == exercise._id) : null;
                    
                    totalAttempts = exerciseStats ? exerciseStats.totalAttempts : 0;
                    let link = `${getBasePath()}/ejercicios/${exercise._id}`;
                    
                    if(getUserRole() !== "student"){
                        link = `${getBasePath()}/ejercicios/${exercise._id}/usuarios/${student._id}`;
                    }
                    return (
                        <section className="exercise-info" key={student._id}>
                            <Link to={link}>
                            <article className="exercise-info">
                                {students?.length > 1 &&
                                    <p>{student.name}</p>
                                }
                                {exerciseStats ?
                                    <HealthBar hp={exerciseStats.correctTests} maxHp={exerciseStats.totalTests} />
                                    :
                                    <HealthBar hp={0} />
                                }
                                <p>{totalAttempts} int.</p>
                            </article>
                            </Link>
                        </section>
                    )
                })}
            </section>
        </div>
    );
}


export default ExerciseStats;