import { useLoaderData,Link } from "react-router-dom";
import { useEffect,useContext,useState } from "react";
import { useNavigate } from "react-router-dom";
import loggedInContext from "../../context/loggedInContext";
import { getAllUsers,deleteUser } from "../../util/api/user";

const Users = () => {
    const data = useLoaderData();
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");
    const {getBasePath} = useContext(loggedInContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (data.error) {
            navigate('/login', { replace: true })
        }
        else {
            setUsers(data)
        }
    }, [])
    useEffect(() => {
        getAllUsers(filter).then((data) => {
            setUsers(data);
        })
    }, [filter]);

    const handleFilter = (e) => {
        const value = e.target.value;
        setFilter(value);
    }
    const handleDelete = (id) => {
        if(!confirm('Seguro que quieres borrar el usuario?')) return;   
        deleteUser(id).then(() => {
            const newUsers = users.filter((user) => user._id !== id);
            setUsers(newUsers);
        })
    }
    if(data && data.error)
    {
        return <div>error</div>
    }

    return (
        <div>
            <h1>Usuarios</h1>
            <input type="text" value={filter} onChange={handleFilter}/>
            <ul className="list">
                {users.map((user) => (
                    <li key={user._id}>
                        <Link to={`${getBasePath()}/usuarios/${user._id}`}>{user.name} | {user.email}</Link>
                        <button onClick={() => handleDelete(user._id)}>Borrar</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Users