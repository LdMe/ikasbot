import {  Link } from "react-router-dom";
import { useContext,useState } from "react";
import loggedInContext from "../../context/loggedInContext";
import { FaPencil } from "react-icons/fa6";
import { renameSubject } from "../../util/api/subject";
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
                <h1>Tema {subject.name}{user.role !="student" && <button onClick={() => setIsEditing(true)} className="icon danger"><FaPencil/></button>}</h1>
            )}
            <p>Curso: <Link to={`${getBasePath()}/cursos/${subject.course._id}`}>{subject.course.name}</Link></p>
            <h2>Ejercicios:</h2>
            <ul className="list">
                {
                    subject.exercises.map((exercise) => (
                        <li key={exercise._id}>
                            <Link to={`${getBasePath()}/ejercicios/${exercise._id}`}>{exercise.name} | {getMappedLevel(exercise.level)}</Link>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}

export default SubjectComponent;