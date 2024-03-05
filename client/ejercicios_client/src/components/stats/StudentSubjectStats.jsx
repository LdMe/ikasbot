import { Link } from 'react-router-dom';
import HealthBar from '../healthBar/HealthBar';
import ExerciseStats from './StudentExerciseStats';
const SubjectStats = ({ subject, students }) => {
    return (
        <section className="subject-card">
            <h2>{subject.name}</h2>
            {students?.map((student) => {
                    const subjectAttempt = student.attempts.find(attempt => {
                        const subjectAttempt = attempt.subjects.find(subjectAttempt => subjectAttempt.subject == subject._id)
                        return subjectAttempt
                    })?.subjects[0]
                    console.log("attempt", subjectAttempt)
                    if (!subjectAttempt) {
                        
                        return (
                            <section className="subject-info" key={student._id}>
                                <article className="subject-info">
                                    <HealthBar hp={20} />
                                </article>
                            </section>
                        )
                    }

                    return (
                        <section className="subject-info" key={student._id}>
                            <article className="subject-info">
                                <HealthBar hp={subjectAttempt.correct} maxHp={subjectAttempt.total} />
                            </article>
                        </section>
                    )
                })}
            <h3>Ejercicios:</h3>
            {subject.exercises?.map((exercise) => {
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