import {useState,useEffect,useContext} from 'react'
import { FaCalendarCheck } from "react-icons/fa";
// input para añadir un profesor a un curso. Debajo del input se muestra una lista de profesores que se pueden añadir al curso, y al hacer click en uno de ellos se añade al curso.
function AddUser({courseId,onAddUser,getUsers,addUser}) {
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState('')
    useEffect(() => {
        getUsers("",10,courseId).then((data) => {
            if(data.message || data.error || data.success == false) return console.error("error")
            setUsers(data)
        })
    }, []);
    
    const handleSearch = (e) => {
        setSearch(e.target.value)
        getUsers(e.target.value,10,courseId).then((data) => {
            if(data.error) return console.error("error")
            setUsers(data)
        });
    }

    const handleSelect = (userId) => {
        
        addUser(courseId,userId).then((data) => {
            setUsers(users.filter((user) => user._id != userId))
            onAddUser(data)
            
        });
    }
    return (
        <>
            <input type="text" onChange={handleSearch} value={search}/>
            <ul>
                {users.length == 0 && <li>No hay usuarios</li>}
                {users?.map((user) => (
                    <li key={user._id}>
                        <button type="button" className='icon correct' value={JSON.stringify(user)} onClick={()=>handleSelect(user._id)}><FaCalendarCheck/></button>
                        <h3>{user.name}</h3>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default AddUser
