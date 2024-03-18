
import { useState, useContext, useEffect } from 'react'
import loggedInContext from '../../context/loggedInContext'
import { useLoaderData,Link } from 'react-router-dom';
import { deleteExercise, updateExercise } from '../../util/api/exercise';
import { useNavigate } from 'react-router-dom';
import CreateExercise from './CreateExercise';
import ExetrciseComponent from '../../components/exercise/ExerciseComponent';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
const Exercise = () => {
    const data = useLoaderData()
    const [exercise, setExercise] = useState(data.exercise)
    const user = data.user?.user || null;
    const [isEditing, setIsEditing] = useState(false)

    const navigate = useNavigate();

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            await deleteExercise(id)
            navigate(-1)
        }
    }

    const handleEditExercise = (exercise) => {
        setIsEditing(!isEditing)
        if (exercise) {
            setExercise(exercise)
        }
    }
    const handleUpdateIsDraft = async () => {
        const newExercise = {...exercise,isDraft:!exercise.isDraft}
        const updatedExercise = await updateExercise(exercise._id,newExercise)
        setExercise(updatedExercise)
    }
    if (isEditing) return (
        <CreateExercise oldExercise={exercise} onSubmit={handleEditExercise} />
    )

    
    return (
        <div>
            {user ? 
            <Link to={`/profesorado/usuarios/${user._id}`}>usuario: {user.name}</Link>
            :
            exercise.isDraft ? <button onClick={handleUpdateIsDraft} className="icon secondary"><FaEyeSlash/></button> : <button onClick={handleUpdateIsDraft} className="icon primary"><FaEye/></button>
            }
            <ExetrciseComponent
                exercise={exercise}
                isAdminOrTeacher={true}
                user={user}
                functions={
                    {
                        handleDelete,
                        setIsEditing
                    }
                }
            />

        </div>
    )
}


export default Exercise
