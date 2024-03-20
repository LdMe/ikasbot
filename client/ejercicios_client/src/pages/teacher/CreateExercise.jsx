import { useState, useEffect, useContext } from 'react'
import { createExercise, updateExercise } from '../../util/api/exercise'
import { useNavigate, useSearchParams } from 'react-router-dom'
import loggedInContext from '../../context/loggedInContext'
import 'highlight.js/styles/atom-one-dark.css';
import { highlight, languages } from 'highlight.js';
import Editor from 'react-simple-code-editor';
import ReactQuill from 'react-quill';
import ClaudeComponent from '../../components/AI/Claude';
import { createExerciseText } from '../../util/api/exercise';
import 'react-quill/dist/quill.snow.css';

function CreateExercise({ oldExercise, onSubmit = null }) {
    const { getUserRole } = useContext(loggedInContext)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [test, setTest] = useState('')
    const [level, setLevel] = useState('easy')
    const [hasTest, setHasTest] = useState(true)
    const [isDraft, setIsDraft] = useState(true)
    const [isDescriptionInHTML, setisDescriptionInHTML] = useState(false)
    const [isCreatingTest, setIsCreatingTest] = useState(false)
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    useEffect(() => {
        if (getUserRole() == "student") {
            navigate('/')
        }
        if (oldExercise) {
            setName(oldExercise.name)
            setDescription(oldExercise.description)
            setTest(oldExercise.test)
            setLevel(oldExercise.level)
            setIsDraft(oldExercise.isDraft || false)
        }
    }, [oldExercise])
    const handleSubmit = async (e) => {
        e.preventDefault()
        const subject = searchParams.get("subject")
        const data = { name, description, test, level, subject: subject ,isDraft}
        e.target.reset()
        let exercise = null;
        if (oldExercise) {
            exercise = await updateExercise(oldExercise._id, data)
        }
        else {
            exercise = await createExercise(data)
        }
        if (onSubmit) {
            onSubmit(exercise)
        }
        else {
            navigate(-1)
        }
    }
    const handleAutoTest = async () => {
        setIsCreatingTest(true)
        const data = await createExerciseText(description, true)
        setIsCreatingTest(false)
        if(data.error){
            return alert(data.error)
        }
        setTest(data.content[0].text)
    }
    const handleCancel = () => {
        if (onSubmit) {
            onSubmit(null)
        }
        else {
            navigate(-1)
        }
    }
    return (
        <>
            <h1>{oldExercise ? "Editar" : "Crear"} Ejercicio</h1>
            <ClaudeComponent onResponse={setDescription} />
            <form className="exercise" onSubmit={handleSubmit}>
                <fieldset>
                <label htmlFor="name">Nombre</label>
                <input type="text" name="name" onChange={(e) => setName(e.target.value)} value={name} />
                <label htmlFor="level">Nivel</label>
                <select name="level" onChange={(e) => setLevel(e.target.value)} value={level}>
                    <option value="easy">Fácil</option>
                    <option value="medium">Medio</option>
                    <option value="difficult">Avanzado</option>
                </select>
                <label htmlFor="isDescriptionInHTML">Descripción en HTML</label>
                <input type="checkbox" name="isDescriptionInHTML" id="isDescriptionInHTML" value={isDescriptionInHTML} onChange={(e) => setisDescriptionInHTML(e.target.checked)} checked={isDescriptionInHTML} />

                </fieldset>
                <label htmlFor="description">Descripción</label>
                {isDescriptionInHTML ?
                    <Editor
                        value={description}
                        className='hljs editor'
                        onValueChange={description => setDescription(description)}
                        highlight={text => highlight(text, { language: "html" }).value}
                        padding={10}
                        style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 12,
                        }}
                    />
                    // <textarea className="ql-editor" name="description" onChange={(e) => setDescription(e.target.value)} value={description} />
                    :
                    <ReactQuill theme="snow" value={description} onChange={setDescription} />
                }
                <label htmlFor="test">Tiene test</label>
                <input type="checkbox" name="hasTest" id="hasTest" value={hasTest} onChange={(e) => setHasTest(e.target.checked)} checked={hasTest} />
                {hasTest &&
                    <section className="create-test">
                        {isCreatingTest ? <p>Generando Tests...</p>
                            :
                            <button type="button" onClick={handleAutoTest}>Crear automáticamente</button>
                        }
                        <Editor
                            value={test}
                            className='hljs editor'
                            onValueChange={test => setTest(test)}
                            highlight={text => highlight(text, { language: "javascript" }).value}
                            padding={10}
                            style={{
                                fontFamily: '"Fira code", "Fira Mono", monospace',
                                fontSize: 12,
                            }}
                        />

                    </section>
                }
                <label htmlFor="isDraft">Guardar como borrador</label>
                <input type="checkbox" name="isDraft" id="isDraft"  onChange={ (e) => setIsDraft(e.target.checked)} checked={isDraft} />
                <button>{oldExercise ? "Guardar" : "Crear"}</button>
                <button type="button" onClick={handleCancel}>Cancelar</button>
            </form>

        </>
    )
}

export default CreateExercise