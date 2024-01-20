

import { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import loggedInContext from "../context/loggedInContext";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [isRegister, setIsRegister] = useState(false);
    const { login } = useContext(loggedInContext);
    const navigate = useNavigate();
    const handleLogin = () => {
        fetch("http://localhost:3001/auth/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        }).then((response) => response.json()).then((data) => {
            login(data.user);
            console.log(data);
            // navigate to home
            navigate("/");
        }).catch((error) => console.log(error))
    }

    const handleRegister = () => {
        fetch("http://localhost:3001/auth/register", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, passwordConfirm })
        }).then((response) => response.json()).then((data) => {
            console.log(data);
        }).catch((error) => console.log(error))
    }

    return (
        <section className="login">
            <h2>{isRegister ? "Registro" : "Login"}</h2>
            <form className="login-form">
                <label htmlFor="username">Nombre de usuario</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {isRegister &&
                    <>
                        <label htmlFor="passwordConfirm">Confirmar Contraseña</label>
                        <input type="password" id="passwordConfirm" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
                    </>
                }
                <button type="button" onClick={isRegister ? handleRegister : handleLogin}>{isRegister ? "Registrarse" : "Login"}</button>
                <button type="button" onClick={() => setIsRegister(!isRegister)}>{isRegister ? "Ya tengo cuenta" : "Crear cuenta"}</button>
                <button type="button" onClick={() => onFinish("map")}>Volver</button>

            </form>
        </section>
    )
}

export default Login;