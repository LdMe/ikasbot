
import HealthBar from '../healthBar/HealthBar';
import { useContext, useEffect, useState } from 'react';
import SubjectStats from './SubjectStats';
import TextShowHide from '../TextShowHide';
import "./Stats.scss";
import { Link } from 'react-router-dom';
const CourseStats = ({ course, students }) => {
    return (
        <div className="course-card">
            {students?.length > 1 && <h3>Estudiantes:</h3>}
            <section className="students">
            {students?.map((student) => {
                const courseSubjects = course.subjects
                let hp = 0;
                let maxHp = 0;
                courseSubjects.forEach(subject => {
                    const exercisesLength = subject.exercises.length
                    maxHp += exercisesLength
                    const subjectAttempt = student.attempts.find(attempt => {
                        const foundAttempt = attempt.subjects.find(subjectAttempt => subjectAttempt.subject == subject._id)
                        return foundAttempt
                    });
                    if (subjectAttempt) {
                        hp += subjectAttempt.correct
                    }
                });

                return (
                    <section className="user-info" key={student._id}>
                        <article className="user-info">
                            {students?.length > 1 &&
                            <Link to={`/profesorado/usuarios/${student._id}`}>
                                <p>{student.name}</p>
                            </Link>
                            }
                            {maxHp!=0 ?
                                <HealthBar hp={hp} maxHp={maxHp} />
                                :
                                <HealthBar hp={0} />
                            }
                        </article>
                    </section>
                )
            })}
            </section>
            <h2>Temas:</h2>
            <section className="subjects" >
                {course.subjects?.map((subject,index) => {
                    return (
                            <SubjectStats key={subject._id} id={index} subject={subject} students={students} />
                    )
                })
                }
            </section>
        </div>
    );
}

export default CourseStats;