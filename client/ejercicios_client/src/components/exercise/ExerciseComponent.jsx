
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
import { set } from 'mongoose';


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
            let attemptsForExercise = user.attempts.filter(attempt => attempt.course == exercise.subject.course);
            if (attemptsForExercise.length == 0) {
                return null
            }
            attemptsForExercise = attemptsForExercise.filter(attempt => attempt.subjects.find(subjectAttempt => subjectAttempt.subject == exercise.subject._id))
            attemptsForExercise = attemptsForExercise.map(attempt => attempt.subjects.find(subjectAttempt => subjectAttempt.subject == exercise.subject._id).exercises)
            attemptsForExercise = attemptsForExercise.flat()
            attemptsForExercise = attemptsForExercise.filter(attempt => attempt.exercise == exercise._id)

            if (attemptsForExercise.length == 0) {
                return null
            }
            let bestAttempt = attemptsForExercise[0].bestAttempt;
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
        return newMessage
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
            <div dangerouslySetInnerHTML={{ __html: exercise.description }}></div>
            <section className="test">
                <section className="test-input">
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
                    <form className="run-test-form" onSubmit={handleSubmit} key={solution.length} >

                        <input type="hidden" name="id" value={exercise._id} />

                        <button>Ejecutar tests</button>
                    </form>
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