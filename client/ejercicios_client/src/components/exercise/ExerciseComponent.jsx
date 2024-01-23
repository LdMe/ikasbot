
import 'highlight.js/styles/atom-one-dark.css';
import Highlight from 'react-highlight'
import { highlight } from 'highlight.js';
import Editor from 'react-simple-code-editor';
import HealthBar from '../healthBar/HealthBar';
import { Link } from 'react-router-dom';
import {useState,useContext} from 'react'
import { createAttempt } from '../../util/api/exercise';
import loggedInContext from '../../context/loggedInContext';


const ExetrciseComponent = ({exercise, isAdminOrTeacher=false,functions={}}) => {
    const {setIsEditing,handleDelete} = functions
    const {getBasePath} = useContext(loggedInContext)
    const [solution, setSolution] = useState('function add(a, b) {\n  return a + b;\n}')
    const [result, setResult] = useState(null)

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
                <Link to={`${getBasePath()}/temas/${exercise.subject?._id}`}>
                    {exercise.subject?.name}
                </Link>
            </p>
            {isAdminOrTeacher && (
                <>
                    <button onClick={() => setIsEditing(true)}>Editar</button>
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

export default ExetrciseComponent