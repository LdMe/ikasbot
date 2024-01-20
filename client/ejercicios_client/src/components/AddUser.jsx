import {useState,useEffect,useContext} from 'react'

// input para añadir un profesor a un curso. Debajo del input se muestra una lista de profesores que se pueden añadir al curso, y al hacer click en uno de ellos se añade al curso.
function AddUser({courseId,onAddUser,getUsers,addUser}) {
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState('')
    useEffect(() => {
        getUsers("",10,courseId).then((data) => {
            console.log("data", data)
            if(data.message || data.error || data.success == false) return console.log("error")
            setUsers(data)
        })
    }, [])
    const handleSearch = (e) => {
        setSearch(e.target.value)
        getUsers(e.target.value,10,courseId).then((data) => {
            console.log("data", data)
            if(data.message || data.error || data.success == false) return console.log("error")
            setUsers(data)
        });
        
    }
    const handleSelect = (userId) => {
        
        addUser(courseId,userId).then((data) => {
            console.log("add user",data)
            setUsers(users.filter((user) => user._id != userId))
            onAddUser(data)
            
        });
    }
    return (
        <>
            <h3>Añadir usuario</h3>
            <input type="text" onChange={handleSearch} value={search}/>
            <ul>
                {users?.map((user) => (
                    <li key={user._id}>
                        <button type="button" value={JSON.stringify(user)} onClick={()=>handleSelect(user._id)}>Añadir</button>
                        {user.username}
                    </li>
                ))}
            </ul>
        </>
    )
}

export default AddUser
