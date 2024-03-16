import NavBar from "../components/NavBar"
import { useEffect, useContext } from "react";
import { Outlet, useNavigate, useLoaderData, useLocation } from "react-router-dom"
import loggedInContext from "../context/loggedInContext";

const Root = () => {
    const { getUser,isCheckingLogin } = useContext(loggedInContext);
    const location = useLocation();

    const navigate = useNavigate();
    
    useEffect(() => {
        if(isCheckingLogin) return;
        if (location.pathname === '/' ) {
            if (getUser()?.role === 'student') {
                navigate('/aula', { replace: true })
            }
            else {
                if (getUser()) {
                    navigate('/profesorado/cursos', { replace: true })
                }
                else {
                    navigate('/login', { replace: true })
                }
            }
        }
    }, [location.pathname,isCheckingLogin])
    return (
        <div>
            <NavBar />
            <section className="outlet-container">
                <Outlet />
            </section>
        </div>
    )
}

export default Root