

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import loggedInContext from "../context/loggedInContext";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const Login = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [isRegister, setIsRegister] = useState(false);
    const { login } = useContext(loggedInContext);
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            if (!response.ok) {
                console.log("error")
                return;
            }
            const data = await response.json();
            login(data.user);
            console.log(data);
            // navigate to home
            navigate("/");
        }
        catch (error) {
            console.log(error)
        }
    }

    const handleRegister = () => {
        fetch(`${BACKEND_URL}/auth/register`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, passwordConfirm })
        }).then((response) => response.json()).then((data) => {
            console.log(data);
        }).catch((error) => console.log(error))
    }

    return (
        <section className="login">
            <h2>{isRegister ? "Registro" : "Login"}</h2>
            <form className="login-form">
                {isRegister &&
                    <>
                        <label htmlFor="name">Nombre</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </>
                }
                <label htmlFor="email">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
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