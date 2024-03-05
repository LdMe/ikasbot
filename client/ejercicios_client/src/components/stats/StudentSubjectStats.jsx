import { Link } from 'react-router-dom';
import { useContext } from 'react';
import HealthBar from '../healthBar/HealthBar';
import ExerciseStats from './StudentExerciseStats';
import loggedInContext from '../../context/loggedInContext';

const SubjectStats = ({ subject, students }) => {
    const { getBasePath } = useContext(loggedInContext)
    return (
        <section className="subject-card">
            <h2>tema: {subject.name}</h2>
            {students?.length > 1 && <h3>Estudiantes:</h3>}
            <section className="students">
            {students?.map((student) => {
                const subjectAttempt = student.attempts.find(attempt => {
                    const subjectAttempt = attempt.subjects.find(subjectAttempt => subjectAttempt.subject == subject._id)
                    return subjectAttempt
                })?.subjects[0]
                console.log("attempt", subjectAttempt)
                return (
                    <section className="subject-info" key={student._id}>
                        <article className="subject-info">
                            {students?.length > 1 &&
                               <Link to={`${getBasePath()}/usuarios/${student._id}`}><p>{student.name}</p></Link>
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
            <h2>Ejercicios:</h2>
            <section className="exercises">
            {subject.exercises?.map((exercise) => {
                return (
                    <section className="exercise-card" key={exercise._id}>
                        <ExerciseStats exercise={exercise} students={students} />
                    </section>
                )
            })}
            </section>
        </section>
    );
}

export default SubjectStats;