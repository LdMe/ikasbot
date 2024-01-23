import { Link } from 'react-router-dom';
import HealthBar from '../healthBar/HealthBar';
import TextShowHide from '../TextShowHide';
import AttemptsShow from '../AttemptsShow';
import loggedInContext from '../../context/loggedInContext';
import { useContext, useEffect, useState } from 'react';
import ExerciseStats from './ExerciseStats';
const SubjectStats = ({ subject, students }) => {
    const { getBasePath } = useContext(loggedInContext)
    const [showStudents, setShowStudents] = useState(false);

    if (showStudents) {
        return (
            <section className="subject-card">
                <h2>{subject.name}</h2>
                <div className="section-buttons">
                    <button onClick={() => setShowStudents(false)}>Ejercicios</button>
                    <button className="selected" >Resultados</button>
                </div>
                {students?.length > 1 && <h3>Estudiantes:</h3>}
                {students?.map((student) => {
                    const attempt = student.attempts.find(attempt => attempt.course == subject.course)
                    if (!attempt) {
                        return (
                            <section className="subject-info" key={student._id}>
                                <article className="subject-info">
                                    {students?.length > 1 &&
                                        <Link to={`${getBasePath()}/usuarios/${student._id}`}><p>{student.name}</p></Link>
                                    }
                                    <HealthBar hp={0} />
                                </article>
                            </section>
                        )
                    }
                    const subjectAttempt = attempt.subjects.find(subjectAttempt => subjectAttempt.subject == subject._id)
                    if (!subjectAttempt) {
                        return (
                            <section className="subject-info" key={student._id}>
                                <article className="subject-info">
                                    {students?.length > 1 &&
                                        <Link to={`${getBasePath()}/usuarios/${student._id}`}><p>{student.name}</p></Link>
                                    }
                                    <HealthBar hp={0} />
                                </article>
                            </section>
                        )
                    }
                    return (
                        <section className="subject-info" key={student._id}>
                            <article className="subject-info">
                                {students?.length > 1 &&
                                    <Link to={`${getBasePath()}/usuarios/${student._id}`}><p>{student.name}</p></Link>
                                }
                                <HealthBar hp={subjectAttempt.correct} maxHp={subjectAttempt.total} />
                            </article>
                        </section>
                    )
                })}
            </section>
        );
    }
    return (
        <section className="subject-card">
            <h2>{subject.name}</h2>
            <div className="section-buttons">
                <button className="selected" >Ejercicios</button>
                <button onClick={() => setShowStudents(true)}>Resultados</button>
            </div>
            <h3>Ejercicios:</h3>
            {subject.exercises?.map((exercise) => {
                console.log("exercise", exercise)
                return (
                    <section className="exercise-card" key={exercise._id}>
                        <ExerciseStats exercise={exercise} students={students} />
                    </section>
                )
            })}
        </section>
    );
}

export default SubjectStats;