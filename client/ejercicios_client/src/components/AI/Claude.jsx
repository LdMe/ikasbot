import Anthropic from "@anthropic-ai/sdk";
import { useState } from "react";
import {createExerciseText} from "../../util/api/exercise";
// import api key from .env using vite
const anthropic = new Anthropic({
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
});



const ClaudeComponent = ({onResponse}) => {
    const [isGenerating, setIsGenerating] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isGenerating) {
            return
        }
        setIsGenerating(true)
        const prompt = document.getElementById("prompt").value
        console.log("prompt", prompt)
        const data = await createExerciseText(prompt)
        console.log("response", data)
        onResponse(data.content[0].text)
        setIsGenerating(false)
    }
    return (
        <section className="claude">
            
            <form onSubmit={handleSubmit}>
                <label htmlFor="prompt">Introduce el texto</label>
            <input type="text" id="prompt" name="prompt"/>
            <button id="submit">Enviar</button>
            </form>
            {isGenerating && <p>Generando ejercicio...</p>}
            
        </section>
    )
}

export default ClaudeComponent;