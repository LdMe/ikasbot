// navbar that navigates using react-router-dom

import { Link } from "react-router-dom";
import loggedInContext from "../context/loggedInContext";
import { useContext } from 'react';
import { logout } from "../util/api/auth";

const NavBar = () => {
    const { isLogged, getUserRole, getUser } = useContext(loggedInContext);
    const TEACHER_URL = "/profesorado";
    console.log("userRole", getUserRole())
    const handleLogout = () => {
        logout();
    }
    return (
        <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
            <Link to="/" className="navbar-brand">Inicio</Link>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav mr-auto">

                    {isLogged ?
                        <>
                            {getUserRole() != "student" &&
                                <>
                                    <li className="navbar-item">
                                        <Link to={`${TEACHER_URL}/cursos`} className="nav-link">Cursos</Link>
                                    </li>
                                    {/* <li className="navbar-item">
                                        <Link to={`${TEACHER_URL}/temas`} className="nav-link">Temas</Link>
                                    </li>
                                    <li className="navbar-item">
                                        <Link to={`${TEACHER_URL}/ejercicios`} className="nav-link">Ejercicios</Link>
                                    </li> */}
                                    <li className="navbar-item">
                                        <Link to={`${TEACHER_URL}/usuarios`} className="nav-link">Usuarios</Link>
                                    </li>

                                </>
                            }
                            <li className="navbar-item">
                                <Link to={`/aula`} className="nav-link">Aula</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/login" className="nav-link" onClick={handleLogout}>Logout</Link>
                            </li>

                        </>
                        :
                        <>
                            <li className="navbar-item">
                                <Link to="/login" className="nav-link">Login</Link>
                            </li>
                        </>
                    }
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;
