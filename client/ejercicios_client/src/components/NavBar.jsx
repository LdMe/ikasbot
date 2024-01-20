// navbar that navigates using react-router-dom

import { Link } from "react-router-dom";
import loggedInContext from "../context/loggedInContext";
import { useContext } from 'react';
import { logout } from "../util/apiCalls";

const NavBar = () => {
    const { isLogged, getUserRole,getUser } = useContext(loggedInContext);

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
                            <li className="navbar-item">
                                <Link to="/cursos" className="nav-link">Cursos</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to={`/profile/${getUser().id}`} className="nav-link">Perfil</Link>
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
                            <li className="navbar-item">
                                <Link to="/register" className="nav-link">Register</Link>
                            </li>
                        </>
                    }
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;
