import { useEffect,useContext } from "react";
import {Outlet, useNavigate,useLoaderData,useLocation} from "react-router-dom"
import loggedInContext from "../../context/loggedInContext";

const StudentRoot = () => {
    const {user} = useLoaderData();
    const {getUser} = useContext(loggedInContext);
    const location = useLocation();
    
    const navigate = useNavigate();
    useEffect(() => {
        if(!user || !getUser() || user.error){
            navigate('/login', { replace: true })
        }
    },[user])
    return (
        <div>
            <Outlet/>
        </div>
    )
}

export default StudentRoot

