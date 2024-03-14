import { useState } from "react";
import {createExerciseText} from "../../util/api/exercise";

import TextShowHide from "../TextShowHide";


const ClaudeComponent = ({onResponse}) => {
    const [isGenerating, setIsGenerating] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isGenerating) {
            return
        }
        setIsGenerating(true)
        const prompt = document.getElementById("prompt").value
        const data = await createExerciseText(prompt)
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
            <form onSubmit={handleSubmit}>
                <label htmlFor="prompt">tema:</label>
            <input type="text" id="prompt" name="prompt"/>
            <button id="submit">Generar</button>
            </form>
            
            </TextShowHide>
        </section>
    )
}

export default ClaudeComponent;