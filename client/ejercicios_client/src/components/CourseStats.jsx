import { Link } from 'react-router-dom';
import HealthBar from './healthBar/HealthBar';
import TextShowHide from './TextShowHide';
import AttemptsShow from './AttemptsShow';
const CourseStats = ({ course }) => {
    return (
        <div className="subjects">
            <h3>Temas:</h3>
            {course.subjects.map((subject) => {
                return (
                    <TextShowHide
                        key={subject._id}
                        title={
                            <article className="subject-info">
                                <Link to={`/temas/${subject._id}`}><p>{subject.name}</p></Link>
                                <HealthBar hp={subject.totalExercisesPassed} maxHp={subject.totalExercises} />
                            </article>
                        }
                    >
                        <>
                            <h2>Ejercicios:</h2>
                            {
                                subject.exercises.map((exercise) => (
                                    <article key={exercise._id} className="exercise-info">
                                        <AttemptsShow key={exercise._id} exerciseData={exercise} />
                                    </article>
                                ))
                            }
                        </>
                    </TextShowHide>
                )
            })}
        </div>
    );
}

export default CourseStats;