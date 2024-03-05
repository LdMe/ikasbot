import { useEffect,useContext } from "react";
import {Outlet, useNavigate,useLoaderData} from "react-router-dom"
import loggedInContext from "../../context/loggedInContext";

const TeacherRoot = () => {
    const {user} = useContext(loggedInContext);
    
    const navigate = useNavigate();
    useEffect(() => {
        if(!user){
            return;
        }
        if( user.error || (user.role != "teacher" && user.role != "admin") ){
            navigate('/login', { replace: true })
        }
    },[user])
    if(!user){
        return <div>Cargando...</div>
    }
    return (
        <div>
            <h1>Área de profesores</h1>
            <Outlet context={user}/>
        </div>
    )
}

export default TeacherRoot

