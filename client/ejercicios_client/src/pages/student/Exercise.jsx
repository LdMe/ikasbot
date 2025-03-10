

import { useLoaderData,Link } from 'react-router-dom';
import ExetrciseComponent from '../../components/exercise/ExerciseComponent';
import { useContext } from 'react';
import loggedInContext from '../../context/loggedInContext';
const Exercise = () => {
    const { exercise, user } = useLoaderData()
    const { getBasePath } = useContext(loggedInContext)


    const subject = exercise.subject
    const course = subject.course;
    return (
        <>
            <div className="breadcrumb">
                <Link to={`${getBasePath()}`}>Aula</Link>
                <span>/</span>
                <Link to={`${getBasePath()}/cursos/${course._id}`}>{course.name}</Link>
                <span>/</span>
                <Link to={`${getBasePath()}/temas/${subject._id}`}>{subject.name}</Link>
            </div>

            <ExetrciseComponent exercise={exercise} user={user.user} />
        </>
    )
}

export default Exercise