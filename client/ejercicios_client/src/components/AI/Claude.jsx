import { useState } from "react";
import {createExerciseText} from "../../util/api/exercise";

import TextShowHide from "../TextShowHide";


const ClaudeComponent = ({onResponse}) => {
    const [isGenerating, setIsGenerating] = useState(false)
    const [prompt, setPrompt] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isGenerating) {
            return
        }
        setIsGenerating(true)
        const newPrompt = document.getElementById("prompt").value
        setPrompt(prompt)
        const data = await createExerciseText(newPrompt)
        onResponse(data.content[0].text)
        setIsGenerating(false)
    }
    if(isGenerating){
        return <p>Generando...</p>
    }
    return (
        <section className="claude">
            <TextShowHide
            title={<h2>Generador de ejercicios</h2>}
            >
            <form className="form-new" onSubmit={handleSubmit}>
                <label htmlFor="prompt">prompt:</label>
            <textarea id="prompt" name="prompt" defaultValue={prompt}></textarea>
            <button id="submit">Generar</button>
            </form>
            
            </TextShowHide>
        </section>
    )
}

export default ClaudeComponent;