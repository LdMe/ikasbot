
import { useState, useContext, useEffect } from 'react'
import loggedInContext from '../../context/loggedInContext'
import { useLoaderData } from 'react-router-dom';
import { deleteExercise, updateExercise } from '../../util/api/exercise';
import { useNavigate } from 'react-router-dom';
import CreateExercise from './CreateExercise';
import ExetrciseComponent from '../../components/exercise/ExerciseComponent';
const Exercise = () => {
    const [exercise,setExercise] = useState(useLoaderData())
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
        if(exercise){
            setExercise(exercise)
        }
    }
    if (isEditing) return (
        <CreateExercise oldExercise={exercise} onSubmit={handleEditExercise} />
    )

    return(
        <ExetrciseComponent
            exercise={exercise}
            isAdminOrTeacher={true}
            functions={
                {
                    handleDelete,
                    setIsEditing
                }
            }
        />
    )
}


export default Exercise
