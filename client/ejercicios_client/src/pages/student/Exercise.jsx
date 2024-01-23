

import { useLoaderData } from 'react-router-dom';
import ExetrciseComponent from '../../components/exercise/ExerciseComponent';
const Exercise = () => {
    const exercise = useLoaderData()

    return (
        <ExetrciseComponent exercise={exercise}  />
    )
}

export default Exercise