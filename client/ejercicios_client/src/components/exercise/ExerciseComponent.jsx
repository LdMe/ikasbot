
import 'highlight.js/styles/atom-one-dark.css';
import Highlight from 'react-highlight'
import { highlight } from 'highlight.js';
import Editor from 'react-simple-code-editor';
import HealthBar from '../healthBar/HealthBar';
import TextShowHide from '../TextShowHide';
import { Link } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react'
import { createAttempt } from '../../util/api/exercise';
import loggedInContext from '../../context/loggedInContext';


const ExetrciseComponent = ({ exercise, user = null, isAdminOrTeacher = false, functions = {} }) => {
    const { setIsEditing, handleDelete } = functions
    const { getBasePath } = useContext(loggedInContext)
    const [solution, setSolution] = useState('const message="Hello World";')
    const [result, setResult] = useState(null)


    useEffect(() => {
        if (user) {
            const bestAttempt = loadBestAttempt(user)
            if (bestAttempt) {
                setSolution(bestAttempt.code)
                setResult(bestAttempt)
            }
        }
    }, [user])
    
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
    const loadBestAttempt = (user) => {
        try {
            const attemptsForSubject = user.attempts.map(attempt => {
                return attempt.subjects[0];
            });
            const attemptsForExercise = attemptsForSubject.filter(attempt => attempt.exercises.find(exerciseAttempt => exerciseAttempt.exercise == exercise._id));
            if (attemptsForExercise.length == 0) {
                return null
            }
            const exerciseAttempts = attemptsForExercise[0].exercises.find(exerciseAttempt => exerciseAttempt.exercise == exercise._id);
            const bestAttempt = exerciseAttempts.attempts.find(attempt => attempt._id = exerciseAttempts.bestAttempt._id);
            return bestAttempt
        }
        catch (err) {
            console.error(err)
            return null
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newResult = { ...result }
        newResult.message = "Ejecutando tests..."
        setResult(newResult)
        const id = e.target.id.value;
        const response = await createAttempt(id, solution)
        setResult(response);
    }
    const formatMessage = (message) => {
        let newMessage = message.replaceAll(/\s*✓/gi, "<br><span class='icon correct'>✓</span>")
        newMessage = newMessage.replaceAll(/\s*✕/gi, "<br><span class='icon incorrect'>✗</span>")
        newMessage = newMessage.replaceAll(/\n/gi, "<br>")
        return newMessage
    }
    if(!exercise){
        return <div>cargando...</div>
    }
    return (
        <div key={exercise._id}>
            <h1>{exercise.name}</h1>

            <p>Tema:
                <Link to={`${getBasePath()}/temas/${exercise.subject?._id}`}>
                    {exercise.subject?.name}
                </Link>
            </p>
            <p>Nivel: {getMappedLevel(exercise.level)}</p>
            {isAdminOrTeacher && (
                <>
                    <button onClick={() => setIsEditing(true)}>Editar</button>
                    <button onClick={() => handleDelete(exercise._id)}>Borrar</button>
                </>
            )
            }
            <div className="enunciado" dangerouslySetInnerHTML={{ __html: exercise.description }}></div>
            <section className="test">
                <section className="test-input">
                    <form className="run-test-form" onSubmit={handleSubmit} key={solution.length} >

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

                </section>

                <section className="test-result">
                    {result &&
                        <section className={"result-section " + (result.success ? "correct" : "incorrect")} >
                            <h3>Resultado:</h3>
                            <HealthBar
                                maxHp={result.total_tests}
                                hp={result.correct_tests}
                            />
                            {result.message &&

                                <code dangerouslySetInnerHTML={{ __html: formatMessage(result.message) }} />

                            }
                        </section>
                    }
                </section>
                <section className="test-tests">
                    <TextShowHide title="Ver tests">
                        <Highlight className='javascript'>
                            <code dangerouslySetInnerHTML={{ __html: exercise.test }}></code>
                        </Highlight>
                    </TextShowHide>
                </section>
            </section>


        </div>
    )
}

export default ExetrciseComponent