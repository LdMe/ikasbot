
import HealthBar from '../healthBar/HealthBar';
import { useContext, useEffect, useState } from 'react';
import SubjectStats from './StudentSubjectStats';
const CourseStats = ({ course, students }) => {
    return (
        <div className="course-card">
            {students?.length > 1 && <h3>Estudiantes:</h3>}
            <section className="students">
            {students?.map((student) => {
                console.log('student', student)
                const courseSubjects = course.subjects
                console.log('courseSubjects', courseSubjects)
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
                                <p>{student.name}</p>
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
            <h3>Temas:</h3>
            <section className="subjects" >
                {course.subjects?.map((subject) => {
                    return (
                        <SubjectStats key={subject._id} subject={subject} students={students} />
                    )
                })
                }
            </section>
        </div>
    );
}

export default CourseStats;