import {  Link } from "react-router-dom";
import { useContext,useState } from "react";
import loggedInContext from "../../context/loggedInContext";
import { FaEye, FaEyeSlash, FaPencil } from "react-icons/fa6";
import { renameSubject } from "../../util/api/subject";
import { updateExercise } from "../../util/api/exercise";
import CopySubject from "./CopySubjectComponent";
const SubjectComponent = ({originalSubject}) => {
    const[subject,setSubject] = useState(originalSubject);
    const [isEditing,setIsEditing] = useState(false);
    const {getBasePath,user} = useContext(loggedInContext)
    const getMappedLevel = (level) => {
        switch (level) {
            case "easy":
                return "Fácil";
            case "medium":
                return "Medio";
            case "difficult":
                return "Avanzado";
            default:
                return "Fácil";
        }
    }
    const handleRename = async(e) => {
        e.preventDefault();
        const name = e.target.name.value.trim();
        if (!name) {
            return;
        }
        const response = await renameSubject(subject._id,name);
        const newSubject = {...subject,name:response.name};
        setSubject(newSubject);
        setIsEditing(false);

    }
    const handleIsDraft = async(exercise) => {
        const newExercise = {...exercise,isDraft:!exercise.isDraft};
        const updatedExercise = await updateExercise(exercise._id,newExercise);
        const newSubject = {...subject,exercises:subject.exercises.map((e) => e._id === exercise._id ? updatedExercise : e)};
        setSubject(newSubject);
    }
    if(!subject)
    {
        return <div>cargando...</div>
    }
    return (
        <div>
            {isEditing ? (
                <form onSubmit={handleRename}>
                    <input type="text" name="name" defaultValue={subject.name} />
                    <button type="submit">Guardar</button>
                    <button onClick={() => setIsEditing(false)}>Cancelar</button>
                </form>
            ) : (
                <h1>{subject.name}{user.role !="student" && <button onClick={() => setIsEditing(true)} className="icon danger"><FaPencil/></button>}</h1>
            )}
            <CopySubject subject={subject} />
            <h2>Ejercicios:</h2>
            <ul className="list">
                {
                    subject.exercises.map((exercise) => (
                        <li key={exercise._id}>
                            <Link to={`${getBasePath()}/ejercicios/${exercise._id}`}>{exercise.name} | {getMappedLevel(exercise.level)} | </Link>
                            <span onClick={() => handleIsDraft(exercise)}>
                             {exercise.isDraft ? <FaEyeSlash className="visible-button secondary"/> : <FaEye className="visible-button primary"/>}

                            </span>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}

export default SubjectComponent;