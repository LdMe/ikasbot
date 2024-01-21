
import { useState, useContext, useEffect } from 'react'
import loggedInContext from '../../context/loggedInContext'
import 'highlight.js/styles/atom-one-dark.css';
import Highlight from 'react-highlight'
import { highlight, languages } from 'highlight.js';
import Editor from 'react-simple-code-editor';
import { useLoaderData } from 'react-router-dom';
import { createAttempt,deleteExercise, updateExercise } from '../../util/apiCalls';
import { useNavigate,Link } from 'react-router-dom';
import CreateExercise from '../teacher/CreateExercise';
import HealthBar from '../../components/healthBar/HealthBar';

const Exercise = () => {
    const [exercise,setExercise] = useState(useLoaderData())
    const [isEditing, setIsEditing] = useState(false)
    const [solution, setSolution] = useState('function add(a, b) {\n  return a + b;\n}')
    const [result, setResult] = useState(null)
    const navigate = useNavigate();
    useEffect(() => {
    if(exercise.error){
        navigate("/")
    }
    },[exercise])
    const handleSubmit = async (e) => {
        e.preventDefault()
        const newResult = {...result}
        newResult.message = "Ejecutando tests..."
        setResult(newResult)
        const id = e.target.id.value;
        const response = await createAttempt(id, solution)
        setResult(response);
    }
   
    return (
        <div key={exercise._id}>
            <h1>{exercise.name}</h1>
            <p> Tema:  
            <Link to={`../temas/${exercise.subject?._id}`}>
             {exercise.subject?.name}
            </Link>
            </p>
            
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
