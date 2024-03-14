

import { useLoaderData } from 'react-router-dom';
import ExetrciseComponent from '../../components/exercise/ExerciseComponent';
import { useContext } from 'react';
import loggedInContext from '../../context/loggedInContext';
const Exercise = () => {
    const {exercise,user} = useLoaderData()

    return (
        <ExetrciseComponent exercise={exercise} user={user.user} />
    )
}

export default Exercise