import { Link } from 'react-router-dom'
import { useState } from 'react'
import HealthBar from './healthBar/HealthBar'
import Highlight from 'react-highlight'
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import TextShowHide from './TextShowHide';
const formatTime = (time) => {
    const date = new Date(time)
    return date.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" }).replace("de", "") + " " + date.toLocaleTimeString()
}
const formatFloat = (number, decimals = 2) => {
    return number.toFixed(decimals)
}
const AttemptsShow = ({ exerciseData }) => {
    const [showAttempts, setShowAttempts] = useState(false)
    console.log("new exercise", exerciseData)
    const exercise = exerciseData.exercise
    const attempts = exerciseData.attempts
    const bestAttempt = exerciseData.bestAttempt
    const isCorrect = exerciseData.isCorrect
    const lastAttempt = attempts.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
    })[0]
    return (
        <div key={exercise._id}>
            <Link to={`/temas/${exercise.subject}/ejercicios/${exercise._id}`}><p>{exercise.name}</p></Link>
            <HealthBar hp={bestAttempt ? bestAttempt.correct_percentage : 0} />
            {lastAttempt && (
            <p>Último intento: {formatTime(lastAttempt.createdAt)}</p>
            )}
            <TextShowHide title={<h3>Intentos: {attempts.length}</h3>} >
            
                <div>
                    <section className="attempt-list">
                        {attempts.map((attempt) => (
                            <article key={attempt._id}>

                                <p>Fecha: {formatTime(attempt.createdAt)}</p>
                                <p>Porcentaje de aciertos: {formatFloat(attempt.correct_percentage)}%</p>
                                <p> {attempt.correct_tests || 0}/{attempt.total_tests || 0} tests pasados</p>
                                <TextShowHide title="Código" >
                                <Highlight className='javascript sm'>
                                    <code dangerouslySetInnerHTML={{ __html: attempt.code }}></code>
                                </Highlight>
                                </TextShowHide>
                                <TextShowHide title="Resultado" >
                                    <Highlight className='javascript sm'>
                                        <code dangerouslySetInnerHTML={{ __html: attempt.message }}></code>
                                    </Highlight>
                                </TextShowHide>
                            </article>
                        ))}
                    </section>
                </div>
            </TextShowHide>
            
        </div>
    )

}

export default AttemptsShow;