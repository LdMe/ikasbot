// navbar that navigates using react-router-dom

import { Link } from "react-router-dom";
import loggedInContext from "../context/loggedInContext";
import { useContext } from 'react';
const NavBar = () => {
    const { isLogged, user,logout } = useContext(loggedInContext);
    const TEACHER_URL = "/profesorado";
    const handleLogout = () => {
        logout();
    }
    return (
        <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
            <Link to="/" className="navbar-brand"><img className="navbar-icon" src="/robot.png"></img><p className="navbar-brand">IkasBot</p></Link>
            
            <div className="collapse navbar-collapse">
                <section className="navbar-nav mr-auto">

                    {isLogged ?
                        <>
                            {user?.role != "student" &&
                                <>
                                    <div className="navbar-item">
                                        <Link to={`${TEACHER_URL}/cursos`} className="nav-link">Cursos</Link>
                                    </div>
                                    {/* <div className="navbar-item">
                                        <Link to={`${TEACHER_URL}/temas`} className="nav-link">Temas</Link>
                                    </div>
                                    <div className="navbar-item">
                                        <Link to={`${TEACHER_URL}/ejercicios`} className="nav-link">Ejercicios</Link>
                                    </div> */}
                                    <div className="navbar-item">
                                        <Link to={`${TEACHER_URL}/usuarios`} className="nav-link">Usuarios</Link>
                                    </div>

                                </>
                            }
                            <div className="navbar-item">
                                <Link to={`/aula`} className="nav-link">Aula</Link>
                            </div>
                            <div className="navbar-item">
                                <Link to="/login" className="nav-link" onClick={handleLogout}>Logout</Link>
                            </div>

                        </>
                        :
                        <>
                            <div className="navbar-item">
                                <Link to="/login" className="nav-link">Login</Link>
                            </div>
                        </>
                    }
                </section>
            </div>
        </nav>
    );
}

export default NavBar;
