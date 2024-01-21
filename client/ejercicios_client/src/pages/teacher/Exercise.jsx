
import { useState, useContext, useEffect } from 'react'
import loggedInContext from '../../context/loggedInContext'
import 'highlight.js/styles/atom-one-dark.css';
import Highlight from 'react-highlight'
import { highlight, languages } from 'highlight.js';
import Editor from 'react-simple-code-editor';
import { useLoaderData } from 'react-router-dom';
import { createAttempt,deleteExercise, updateExercise } from '../../util/apiCalls';
import { useNavigate,Link } from 'react-router-dom';
import CreateExercise from './CreateExercise';
import HealthBar from '../../components/healthBar/HealthBar';

const Exercise = () => {
    const [exercise,setExercise] = useState(useLoaderData())
    const [isEditing, setIsEditing] = useState(false)
    const { getUserName, getUserRole } = useContext(loggedInContext)
    const [solution, setSolution] = useState('function add(a, b) {\n  return a + b;\n}')
    const [result, setResult] = useState(null)
    const navigate = useNavigate();
    useEffect(() => {
    if(exercise.error){
        navigate("/")
    }
    },[exercise])
    const handleEdit = (e) => {
        e.preventDefault()
        setIsEditing(!isEditing)
        const data = { name: e.target.name.value, description: e.target.description.value, test: e.target.test.value }
        updateExercise(exercise._id, data).then((response) => {
            setExercise(response)
        })
    }
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            await deleteExercise(id)
            navigate(-1)
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const newResult = {...result}
        newResult.message = "Ejecutando tests..."
        setResult(newResult)
        const id = e.target.id.value;
        const response = await createAttempt(id, solution)
        setResult(response);
    }
    const handleEditExercise = (exercise) => {
        setIsEditing(!isEditing)
        if(exercise){
            setExercise(exercise)
        }
    }
    const role = getUserRole()
    const isAdminOrTeacher = role == "admin" || role == "teacher"
    if (isEditing) return (
        <CreateExercise oldExercise={exercise} onSubmit={handleEditExercise} />
    )
   
    return (
        <div key={exercise._id}>
            <h1>{exercise.name}</h1>
            <p>Creado por {exercise.createdBy?.name}</p>
            <p> Tema:  
            <Link to={`../temas/${exercise.subject?._id}`}>
             {exercise.subject?.name}
            </Link>
            </p>
            {isAdminOrTeacher  && (
                <>
                    <button onClick={() => setIsEditing(!isEditing)}>Editar</button>
                    <button onClick={() => handleDelete(exercise._id)}>Borrar</button>

                </>
            )
            }
            <div dangerouslySetInnerHTML={{ __html: exercise.description }}></div>
            <Highlight className='javascript'>
                <code dangerouslySetInnerHTML={{ __html: exercise.test }}></code>
            </Highlight>

            <form onSubmit={handleSubmit} key={solution.length} >

                <input type="hidden" name="id" value={exercise._id} />

                <button>Ejecutar tests</button>
            </form>
            <Editor
                value={solution}
                className='hljs editor'
                onValueChange={solution => setSolution(solution)}
                highlight={text => highlight(text, { language: "javascript" }).value}
                padding={10}
                style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 12,
                }}
            />
            {result &&
                <section className={"result-section " + (result.success ? "correct" : "incorrect")} >
                    <HealthBar
                    maxHp={100}
                    hp={result.correct_percentage}
                />
                    <code>{result.message}</code>
                </section>
            }


        </div>
    )
}


export default Exercise
