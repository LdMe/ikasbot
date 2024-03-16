import NavBar from "../components/NavBar"
import { useEffect,useContext } from "react";
import {Outlet, useNavigate,useLoaderData,useLocation} from "react-router-dom"
import loggedInContext from "../context/loggedInContext";

const Root = () => {
    const {getUser} = useContext(loggedInContext);
    const location = useLocation();
    
    const navigate = useNavigate();
    useEffect(() => {
        if( !getUser() ){
            navigate('/login', { replace: true })
        }
    },[])
    useEffect(() => {
        console.log("location.pathname",location.pathname)
        
        if(location.pathname === '/'){
            if(getUser()?.role === 'student'){
            navigate('/aula', { replace: true })
            }
            else{
                navigate('/profesorado/cursos', { replace: true })
            }
        }
    },[location.pathname])
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