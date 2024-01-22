

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import loggedInContext from "../context/loggedInContext";
import {login as loginApi,register} from "../util/api/auth";

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
            const data = await loginApi(email, password);
            if(data.error){
                console.log(data.error);
                alert(data.error);
                return;
            }
            login(data.user);
            console.log(data);
            // navigate to home
            navigate("/");
        }
        catch (error) {
            console.error(error)
        }
    }

    const handleRegister = () => {
        const result = register(name, email, password, passwordConfirm);
        if(result.error){
            alert(result.error);
            return;
        }
        login(result.user);
        navigate("/");
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