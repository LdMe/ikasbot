import { Link } from 'react-router-dom';
import { useContext } from 'react';
import HealthBar from '../healthBar/HealthBar';
import ExerciseStats from './ExerciseStats';
import loggedInContext from '../../context/loggedInContext';
import TextShowHide from '../TextShowHide';
import "./Stats.scss";
const SubjectStats = ({ subject, students, id = 0 }) => {
    const { getBasePath } = useContext(loggedInContext)
    return (
        <section className="subject-card" >
            <h2> {subject.name}</h2>
            {students?.length > 1 && <h3>Estudiantes:</h3>}
            <section className="students">
                {students?.map((student) => {
                    /* const subjectAttempt = student.attempts.find(attempt => {
                        const subjectAttempt = attempt.subjects.find(subjectAttempt => subjectAttempt.subject == subject._id)
                        return subjectAttempt
                    })?.subjects[0] */
                    const subjectStats = student.stats.find(stat => stat.subject.subject == subject._id);
                    const correct = subjectStats ? subjectStats.subject.correctExercises : 0;
                    const total = subjectStats ? subjectStats.subject.totalExercises : 0;
                    const subjectAttempt = { correct, total }
                    
                    return (
                        <section className="subject-info" key={student._id}>
                            <article className="subject-info">
                                {students?.length > 1 &&
                                    <Link   to={`${getBasePath()}/usuarios/${student._id}`}><p>{student.name}</p></Link>
                                }
                                {subjectAttempt ?
                                    <HealthBar hp={subjectAttempt.correct} maxHp={subjectAttempt.total} />
                                    :
                                    <HealthBar hp={0} />
                                }

                            </article>
                        </section>
                    )
                })}
            </section>
            <TextShowHide title={<h2>Ejercicios:</h2>}>
                <section className="exercises">
                    {subject.exercises?.map((exercise, index) => {
                        return (
                            
                            <section className="exercise-card"   key={exercise._id}>
                                
                                <ExerciseStats
                                    id={index}
                                    exercise={exercise}
                                    students={students}
                                />
                            </section>
                        )
                    })}
                </section>
            </TextShowHide>
        </section>
    );
}

export default SubjectStats;