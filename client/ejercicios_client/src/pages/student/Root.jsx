import { useEffect,useContext } from "react";
import {Outlet, useNavigate,useLoaderData} from "react-router-dom"
import loggedInContext from "../../context/loggedInContext";

const StudentRoot = () => {
    const user = useLoaderData();
    const {getUser} = useContext(loggedInContext);
    
    const navigate = useNavigate();
    useEffect(() => {
        if(!user || !getUser() || user.error){
            console.log("no logueado")
            navigate('/login', { replace: true })
        }
    },[user])
    return (
        <div>
            <h1>Aula</h1>
            <Outlet context={user}/>
        </div>
    )
}

export default StudentRoot

